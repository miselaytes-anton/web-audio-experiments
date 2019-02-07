import {mapParamRange, getFeatureStore} from './utils';
import {rLinearGradient, hex2rgb, rgb2hex} from 'kandinsky-js';

const featureRanges = {
  spectralCentroid: [240, 260],
  mfcc: [-30, 80],
  loudness: [0, 24]
};
const visualRanges = {
  R: [30, 100],
  r: [0, 200],
  colorIndex: [0, 19]
};
const colors = rLinearGradient(
  featureRanges.spectralCentroid[1] - featureRanges.spectralCentroid[0],
  hex2rgb('#f92104'),
  hex2rgb('#f9f904'),
).map(rgb2hex);
const {storeFeature, getFeature} = getFeatureStore(25);
const {storeFeature: storeFeatureSlow, getFeature: getFeatureSlow} = getFeatureStore(40);

const getCoord = (circleCenter, angleStep, R, values, i, frameNum) =>
   ([
    circleCenter.x + Math.sin(angleStep * (i + frameNum / 60)) * (R + values[i]),
    circleCenter.y + Math.cos(angleStep * (i + frameNum / 60)) * (R + values[i])
  ]);
const numCoefs = 13;
const weights = [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

export const draw = canvasContext => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvasContext.canvas.width = w;
  canvasContext.canvas.height = h;
  const mapParam = mapParamRange(featureRanges, visualRanges);
  const circleCenter = {
    x: w / 2,
    y: h / 2
  };
  const angleStep = 2 * Math.PI / (numCoefs);

  return (features, frameNum) => {
    const {mfcc, spectralCentroid, loudness} = features;
    canvasContext.clearRect(0, 0, w, h);
    canvasContext.beginPath();
    storeFeatureSlow('loudness', loudness);
    storeFeatureSlow('spectralCentroid', spectralCentroid);
    mfcc.forEach((v, i) => storeFeature(`mfcc${i}`, v));

    const loudnessAvg = getFeatureSlow('loudness');
    const R = mapParam('loudness', 'R', loudnessAvg);
    const mappedMFCC = mfcc.map((v, i) => mapParam('mfcc', 'r', getFeature(`mfcc${i}`) ** weights[i]));

    for (let i = 0; i < numCoefs; i++) {
      const coords = getCoord(circleCenter, angleStep, R, mappedMFCC, i, frameNum);
      if (i === 0) {
        canvasContext.moveTo(...coords);
      } else {
        canvasContext.lineTo(...coords);
      }
    }
    canvasContext.lineTo(...getCoord(circleCenter, angleStep, R, mappedMFCC, 0, frameNum));
    const colorIndex = Math.floor(mapParam('spectralCentroid', 'colorIndex', getFeatureSlow('spectralCentroid')));
    canvasContext.fillStyle = colors[colorIndex];
    canvasContext.fill();
  };
};
