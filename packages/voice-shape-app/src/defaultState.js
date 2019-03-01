import {getAudioContext} from 'web-audio-utils';

export default {
  audioBuffer: null,
  features: {mfcc: new Array(13).fill(0), f0: null},
  audioContext: getAudioContext(),
};
