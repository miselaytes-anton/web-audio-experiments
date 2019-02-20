import Meyda from 'meyda';

import {signalToFrames, singalPow2Len} from 'web-audio-utils';
import {lbg, vAvg} from './lbg';

export const extractFeatures = (signal, sampleRate) => {
  const {spectralCentroid} = Meyda.extract(['spectralCentroid'], singalPow2Len(signal));
  const frames = signalToFrames(signal, sampleRate, {});
  const features = frames
    .map(frame => Meyda.extract('mfcc', frame));
  const codebook = lbg(features);
  return {mfcc: vAvg(codebook), spectralCentroid};
};

export const playAudio = (audioContext, audioBuffer) => {
  if (audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
};
