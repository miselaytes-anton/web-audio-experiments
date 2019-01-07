import {getAudioContext, getRandomTrack, getAudioBuffer} from 'web-audio-utils';
import visualizer from './visualizer';
import trackFixed from './T1227R01.mp3';

const getRms = timeDataArray => {
  let rms = 0;
  for (let i = 0; i < timeDataArray.length; i++) {
    rms += Math.pow(timeDataArray[i], 2);
  }
  rms = rms / timeDataArray.length;
  rms = Math.sqrt(rms);

  return rms;
};
const getAnalyzer = audioContext => {
  const fftSize = 256;
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = 0.95;
  const freqDataArray = new Float32Array(analyser.frequencyBinCount);
  const timeDataArray = new Float32Array(analyser.frequencyBinCount);

  analyser.getAudioFeatures = () => {
    analyser.getFloatFrequencyData(freqDataArray);
    analyser.getFloatTimeDomainData(timeDataArray);
    const rms = getRms(timeDataArray);
    return {frequencyData: freqDataArray, timeDomainData: timeDataArray, rms};
  };
  return analyser;
};

const visualize = (getAudioFeatures, draw) => {
  const features = getAudioFeatures();
  requestAnimationFrame(() => {
    draw(features);
    visualize(getAudioFeatures, draw);
  });
};

const audioContext = getAudioContext();
//const track = getRandomTrack();
getAudioBuffer(audioContext, trackFixed).then(audioBuffer => {
  const audioBufferSourceNode = new AudioBufferSourceNode(audioContext, {buffer: audioBuffer, loop: true});
  audioBufferSourceNode.start();
  audioBufferSourceNode.connect(audioContext.destination);

  const analyser = getAnalyzer(audioContext);
  audioBufferSourceNode.connect(analyser);

  const canvas = document.getElementById('the-canvas');
  const canvasContext = canvas.getContext('2d');
  const draw = visualizer.draw(canvasContext);

  visualize(analyser.getAudioFeatures, draw);
}).catch(console.error);
