import Meyda from 'meyda';

import {signalToFrames} from 'web-audio-utils';
import {vAvg, avg} from './lbg';

export const extractFeatures = (signal, sampleRate) => {
  const frames = signalToFrames(signal, sampleRate, {});
  const mfcc = frames
    .map(frame => Meyda.extract('mfcc', frame));
  const spectralCentroid = frames
    .map(frame => Meyda.extract('spectralCentroid', frame));
  return {mfcc: vAvg(mfcc), spectralCentroid: avg(spectralCentroid)};
};

export const playAudio = (audioContext, audioBuffer) => {
  if (audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
};
