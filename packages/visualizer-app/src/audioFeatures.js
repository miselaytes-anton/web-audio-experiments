import {avg} from './utils';

const DEFAULT_SAMPLE_RATE = 44100;

/**
 *
 * @param timeDataArray [-1,1]
 * @returns {number} [0, 1]
 */
export const getRms = timeDataArray => avg(timeDataArray.map(v => v ** 2)) ** 1 / 2;

export const getNyquist = sampleRate => sampleRate / 2;

/**
 *
 * @param freqDataArray [-100, -30]
 * @param freqRange
 * @param sampleRate
 * @returns {number} [-100, -30]
 */
export const getEnergy = (freqDataArray, freqRange, sampleRate = DEFAULT_SAMPLE_RATE) => {
  const nyquist = getNyquist(sampleRate);
  const freqIndexes = freqRange.map(freq => freq / nyquist * freqDataArray.length);
  return avg(freqDataArray.slice(freqIndexes[0], freqIndexes[1] + 1));
};

export const getEnergySpread = (freqDataArray, sampleRate = DEFAULT_SAMPLE_RATE) => {
  const ranges = {
    bass: [20, 140],
    lowMid: [140, 400],
    mid: [400, 2600],
    highMid: [2600, 5200],
    treble: [5200, 14000]
  };

  return {
    bass: getEnergy(freqDataArray, ranges.bass, sampleRate),
    lowMid: getEnergy(freqDataArray, ranges.lowMid, sampleRate),
    mid: getEnergy(freqDataArray, ranges.mid, sampleRate),
    highMid: getEnergy(freqDataArray, ranges.highMid, sampleRate),
    treble: getEnergy(freqDataArray, ranges.treble, sampleRate),
  };
};
