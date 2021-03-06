import {getAudioContext, getAudioBuffer, getRandomTrack, getLiveAudio} from 'web-audio-utils';
import {draw as draw1} from './visualizer1';
import {draw as draw2} from './visualizer2';
import {init} from './startScreen';
import Meyda from 'meyda';

import male from '../audio/male.mp3';
import female from '../audio/female.mp3';
import music from '../audio/music.mp3';

const tracks = {male, female, music};

const getAnalyzerNode = (audioContext, {fftSize = 512, smoothingTimeConstant = 0.95}) => {
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
    Meyda.bufferSize = fftSize;
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

let frameNum = 0;
const visualize = (getAudioFeatures, draw) => {
  requestAnimationFrame(() => {
    frameNum++;
    const features = getAudioFeatures();
    draw(features, frameNum);
    visualize(getAudioFeatures, draw);
  });
};

const getDrawFunction = visualizerType => {
  switch (visualizerType) {
    case 'angry-rays':
      return draw2;
    default:
      return draw1;
  }
};
const getTrack = input => input === 'lomax' ? getRandomTrack() : (tracks[input] || tracks.female);
const getSourceNode = ({audioContext, inputType}) =>
  inputType === 'mic'
    ? getLiveAudio(audioContext, {
      autoGainControl: true,
      echoCancellation: true,
      noiseSuppression: true,
    })
    : getAudioBuffer(audioContext, getTrack(inputType))
      .then(audioBuffer => {
      const audioBufferSourceNode = new AudioBufferSourceNode(audioContext, {buffer: audioBuffer, loop: true});
      audioBufferSourceNode.start();
      audioBufferSourceNode.connect(audioContext.destination);
      return audioBufferSourceNode;
    });

const startVisualizer = ({visType, inputType}) => {
  const audioContext = getAudioContext();
  const canvas = document.getElementById('the-canvas');
  const canvasContext = canvas.getContext('2d');
  const draw = getDrawFunction(visType);

  getSourceNode({audioContext, inputType})
    .then(sourceNode => {
      const analyser = getAnalyzerNode(audioContext, {fftSize: 1024});
      sourceNode.connect(analyser);
      visualize(analyser.getAudioFeatures, draw(canvasContext));
    })
    .catch(console.error);
};

init({onStartClick: startVisualizer});
