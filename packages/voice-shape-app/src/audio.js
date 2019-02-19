import Meyda from 'meyda';

import {closestPowerOf2} from 'web-audio-utils';

export const extractFeatures = signal => {
  const signalOfSize = signal.slice(0, closestPowerOf2(signal.length));
  const features = Meyda.extract(['mfcc', 'spectralCentroid'], signalOfSize)
  console.log(features);
  return features;
};

export const playAudio = (audioContext, audioBuffer) => {
  if (audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
};

