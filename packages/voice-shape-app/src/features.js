import Meyda from 'meyda';

const closestPowerOf2 = number => 2 ** Math.floor(Math.log2(number));
export const extract = signal => {
  const signalOfSize = Array.from(signal).slice(0, closestPowerOf2(signal.length));
  const features = Meyda.extract(['mfcc', 'spectralCentroid'], signalOfSize)
  console.log(features);
  return features;
};
