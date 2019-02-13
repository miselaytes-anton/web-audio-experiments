import Meyda from 'meyda';

const closestPowerOf2 = number => 2 ** Math.floor(Math.log2(number));
export const generate = signal => {
  const signalOfSize = Array.from(signal).slice(0, closestPowerOf2(signal.length))
  const {mfcc} = Meyda.extract(['mfcc'], signalOfSize);
  return mfcc;
};
