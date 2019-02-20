const mfcc = new Array(13).fill(0);

export default {
  audioBuffer: null,
  features: {codebook: new Array(16).fill(mfcc), spectralCentroid: null},
  audioContext: new AudioContext(),
};
