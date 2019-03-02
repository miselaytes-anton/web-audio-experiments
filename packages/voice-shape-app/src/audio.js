import Meyda from 'meyda';

import {signalToFrames, getF0, vAvg, avg} from 'web-audio-utils';
import {humanVoiceRange} from './constants';

export const extractFeatures = (signal, sampleRate) => {
  const frames = signalToFrames(signal, sampleRate, {});

  Meyda.bufferSize = 512;
  const mfcc = frames
    .map(frame => Meyda.extract('mfcc', frame));

  Meyda.bufferSize = 2048;
  const f0 = frames
      .map(frame => Meyda.extract('amplitudeSpectrum', frame))
      .map(binsPerFrame => getF0(binsPerFrame, sampleRate, humanVoiceRange));
  return {mfcc: vAvg(mfcc), f0: avg(f0)};
};

export const playAudio = (audioContext, audioBuffer) => {
  if (audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
};
