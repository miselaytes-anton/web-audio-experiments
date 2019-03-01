export default {
  audioBuffer: null,
  features: {mfcc: new Array(13).fill(0), f0: null},
  audioContext: new AudioContext(),
};
