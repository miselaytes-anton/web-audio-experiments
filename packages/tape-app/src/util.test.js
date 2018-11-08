import assert from 'assert';
import {coordToAngle, angleToCoord, rotate, normCoord, denormCoord, mapRange, clamp} from './util';

describe('util', () => {
  describe('coordToAngle', () => {
    it('should coordToAngle', () => {
     assert.deepStrictEqual(coordToAngle([1, 0]), 0);
     assert.deepStrictEqual(coordToAngle([-1, 0]), 180);
     assert.deepStrictEqual(coordToAngle([0, 1]), 90);
     assert.deepStrictEqual(coordToAngle([0, -1]), 270);
    });
  });

  describe('angleToCoord', () => {
    it('should angleToCoord', () => {
      assert.deepStrictEqual(angleToCoord(0), [1, 0]);
      assert.deepStrictEqual(angleToCoord(180), [-1, 0]);
      assert.deepStrictEqual(angleToCoord(90), [0, 1]);
      assert.deepStrictEqual(angleToCoord(270), [0, -1]);
    });
  });

  describe('rotate', () => {
    it('should rotate', () => {
      assert.deepStrictEqual(rotate(0, 0), 0);
      assert.deepStrictEqual(rotate(90, 0), 90);
      assert.deepStrictEqual(rotate(380, 0), 20);
      assert.deepStrictEqual(rotate(-380, 0), 340);
    });
  });

  describe('normCoord', () => {
    it('should normCoord', () => {
      assert.deepStrictEqual(normCoord([10, 10], [15, 15], 5), [1, -1]);
    });
  });

  describe('denormCoord', () => {
    it('should denormCoord', () => {
      assert.deepStrictEqual(denormCoord([10, 10], [1, -1], 5), [15, 15]);
    });
  });

  describe('mapRange', () => {
    it('should mapRange', () => {
      assert.deepStrictEqual(mapRange([0, 10], [0, 1], 3), 0.3);
      assert.deepStrictEqual(mapRange([10, 0], [0, 1], 3), 0.7);
    });
  });

  describe('clamp', () => {
    it('should clamp', () => {
      assert.deepStrictEqual(clamp([0, 10], -1), 0);
      assert.deepStrictEqual(clamp([0,10], 5), 5);
      assert.deepStrictEqual(clamp([0,10], 20), 10);
    });
  });
});
