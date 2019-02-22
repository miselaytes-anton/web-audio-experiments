import assert from 'assert';
import {removeSilence, signalToFrames} from './index.js';

describe('removeSilence', () => {
  it('should removeSilence', () => {
    const signal = [0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0];
    const sampleRate = 40;
    const expectedSignal = [1, 1, 1, 0, 1, 1, 1, 1];
    const withoutSilence = removeSilence(signal, sampleRate, {minSilenceDuration: 25, threshold: -100});
    assert.deepStrictEqual(withoutSilence, expectedSignal);
  });
});

describe('signalToFrames', () => {
  it('is should split signal to frames', () => {
    const signal = [1, 2, 3, 4, 5, 6, 7, 8];
    const sampleRate = 4;
    const frameLengthMs = 500;
    const overlapLengthMs = 250;
    const expectedFrames = [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8]
    ];
    assert.deepStrictEqual(signalToFrames(signal, sampleRate, {frameLengthMs, overlapLengthMs}), expectedFrames);
  });
});
