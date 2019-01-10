import {getAudioContext, getRandomTrack, getAudioBuffer} from 'web-audio-utils';
import {draw as draw1} from './visualizer1';
import {draw as draw2} from './visualizer2';

import trackFixed from './T1227R01.mp3';
import {getRms, getEnergySpread} from './audioFeatures';

const getAnalyzer = (audioContext, {fftSize = 256, smoothingTimeConstant = 0.95}) => {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = smoothingTimeConstant;
  analyser.minDecibels = -100;
  analyser.maxDecibels = -30;

  const freqDataArray = new Float32Array(analyser.frequencyBinCount);
  const timeDataArray = new Float32Array(analyser.frequencyBinCount);

  analyser.getAudioFeatures = () => {
    // default range [-100, -30]
    analyser.getFloatFrequencyData(freqDataArray);
    // default range [-1, 1]
    analyser.getFloatTimeDomainData(timeDataArray);
    const frequencyData = Array.from(freqDataArray);
    const timeDomainData = Array.from(timeDataArray);
    const rms = getRms(timeDomainData);
    const energySpread = getEnergySpread(freqDataArray);
    return {frequencyData, timeDomainData, rms, energySpread};
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
const track = trackFixed;
getAudioBuffer(audioContext, track).then(audioBuffer => {
  const audioBufferSourceNode = new AudioBufferSourceNode(audioContext, {buffer: audioBuffer, loop: true});
  audioBufferSourceNode.start();
  audioBufferSourceNode.connect(audioContext.destination);
  const analyser = getAnalyzer(audioContext, {});
  audioBufferSourceNode.connect(analyser);
  const canvas = document.getElementById('the-canvas');
  const canvasContext = canvas.getContext('2d');
  visualize(analyser.getAudioFeatures, draw1(canvasContext));
}).catch(console.error);
