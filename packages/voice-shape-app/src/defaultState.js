export default {
  audioBuffer: null,
  features: {mfcc: new Array(13).fill(0), spectralCentroid: null},
  audioContext: new AudioContext(),
};
