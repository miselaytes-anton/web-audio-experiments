import {getAudioContext, getRandomTrack, getAudioBuffer} from 'web-audio-utils';
import Meyda from 'meyda';
import visualizer from './visualizer';
import trackFixed from './T1227R01.mp3';

const getAnalyzer = audioContext => {
  const bufferLength = 256;
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = bufferLength;
  analyser.smoothingTimeConstant = 0.95;
  const freqDataArray = new Float32Array(bufferLength);
  const timeDataArray = new Float32Array(bufferLength);

  analyser.getAudioFeatures = () => {
    analyser.getFloatFrequencyData(freqDataArray);
    analyser.getFloatTimeDomainData(timeDataArray);
    const features = Meyda.extract([
      'rms',
      // 'spectralCentroid',
      // 'spectralSkewness',
      // 'loudness',
      // 'perceptualSpread',
      // 'perceptualSharpness'
    ],
      timeDataArray
    );
    return {frequencyData: freqDataArray, timeDomainData: timeDataArray, ...features};
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
  // console.log('numbers in range [-1.0; 1.0]', audioBuffer);
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