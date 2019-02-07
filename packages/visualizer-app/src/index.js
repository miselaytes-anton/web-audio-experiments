import {getAudioContext, getLiveAudio, getAudioBuffer} from 'web-audio-utils';
import {draw as draw1} from './visualizer1';
import {draw as draw2} from './visualizer2';
import Meyda from 'meyda';

import male from '../audio/male.mp3';
import female from '../audio/female.mp3';
import music from '../audio/music.mp3';

const tracks = {male, female, music};

const getAnalyzer = (audioContext, {fftSize = 512, smoothingTimeConstant = 0.95}) => {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = smoothingTimeConstant;
  analyser.minDecibels = -100;
  analyser.maxDecibels = -30;

  const freqDataArray = new Uint8Array(analyser.frequencyBinCount);
  const timeDataFloatArray = new Float32Array(analyser.frequencyBinCount);

  analyser.getAudioFeatures = () => {
    analyser.getByteFrequencyData(freqDataArray);
    analyser.getFloatTimeDomainData(timeDataFloatArray);

    const frequencyData = Array.from(freqDataArray);
    Meyda.fftSize = fftSize;
    const {mfcc, spectralCentroid, rms, loudness} = Meyda.extract([
        'mfcc',
        'spectralCentroid',
        'rms',
        'loudness',
      ],
      timeDataFloatArray
    );
    return {frequencyData, rms, mfcc, spectralCentroid, loudness: loudness.total};
  };
  return analyser;
};

const visualize = (getAudioFeatures, draw) => {
  requestAnimationFrame(() => {
    const features = getAudioFeatures();
    draw(features);
    visualize(getAudioFeatures, draw);
  });
};

const getDrawFunction = visualizerType => {
  switch (visualizerType) {
    case '2':
      return draw2;
    default:
      return draw1;
  }
};

const getSourceNode = ({audioContext, input}) =>
  input === 'mic'
    ? getLiveAudio(audioContext)
    : getAudioBuffer(audioContext, tracks[input] || female)
      .then(audioBuffer => {
      const audioBufferSourceNode = new AudioBufferSourceNode(audioContext, {buffer: audioBuffer, loop: true});
      audioBufferSourceNode.start();
      return audioBufferSourceNode;
    });

const urlParams = new URLSearchParams(window.location.search);
const visualizerType = urlParams.get('type');
const input = urlParams.get('input');
const audioContext = getAudioContext();

getSourceNode({audioContext, input})
  .then(sourceNode => {
    const analyser = getAnalyzer(audioContext, {fftSize: 2048});
    sourceNode.connect(analyser);
    const canvas = document.getElementById('the-canvas');
    const canvasContext = canvas.getContext('2d');
    const draw = getDrawFunction(visualizerType);
    visualize(analyser.getAudioFeatures, draw(canvasContext));
  })
  .catch(console.error);
