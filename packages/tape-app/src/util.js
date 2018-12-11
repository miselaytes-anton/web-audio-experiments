import tracks from './tracks.json';
import {sample} from 'lodash';

export const randomTrack = () => `https://amiselaytes.com/lomax/audio/${sample(tracks)}.mp3`;
export const degToRad = deg => deg * Math.PI / 180;
export const radToDeg = rad => rad * 180 / Math.PI;

export const hip = (a, b) => Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
export const mapRange = (fromRange, toRange, number) =>
  (number - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];

export const coordToAngle = ([x, y]) => {
  const angle = radToDeg(Math.atan2(y, x));
  return angle < 0 ? angle + 360 : angle;
};

export const toFixed = (float, dec) => parseFloat(float.toFixed(dec));

export const angleToCoord = angle =>
  [Math.cos(degToRad(angle)), Math.sin(degToRad(angle))].map(num => toFixed(num, 2));

export const rotate = (rotateAngle, angle) => {
  const rotated = (angle + rotateAngle) % 360;
  return rotated < 0 ? 360 + rotated : rotated;
};

export const normCoord = ([centerX, centerY], [x, y], r) => [x - centerX, -(y - centerY)].map(coord => coord / r);
export const denormCoord = ([centerX, centerY], [x, y], r) => [x * r + centerX, -y * r + centerY];

export const clamp = ([min, max], value) => value < min ? min : (value > max ? max : value);

