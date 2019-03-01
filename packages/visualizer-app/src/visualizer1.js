import {mapParamRange, getFeatureStore, scale} from './utils';
import {rLinearGradient, hex2rgb, rgb2hex} from 'kandinsky-js';
import {setCanvasSize} from 'canvas-utils';

const featureRanges = {
  spectralCentroid: [240, 260],
  mfcc: [-30, 80],
  loudness: [0, 24]
};

const colors = rLinearGradient(
  featureRanges.spectralCentroid[1] - featureRanges.spectralCentroid[0],
  hex2rgb('#f92104'),
  hex2rgb('#f9f904'),
).map(rgb2hex);
const {storeFeature, getFeature} = getFeatureStore(40);

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
  setCanvasSize(canvasContext, w, h);
  const scaleForHeight = scale(h);
  const visualRanges = {
    R: [3, 15].map(scaleForHeight),
    r: [0, 70].map(scaleForHeight),
    colorIndex: [0, 19]
  };

  const mapParam = mapParamRange(featureRanges, visualRanges);
  const circleCenter = {
    x: w / 2,
    y: h / 2
  };
  const angleStep = 2 * Math.PI / (numCoefs);

  return (features, frameNum) => {
    const {mfcc, spectralCentroid, loudness} = features;
    canvasContext.fillStyle = 'rgba(0,0,0,0.1)';

    canvasContext.fillRect(0, 0, w, h);
    canvasContext.beginPath();
    storeFeature('loudness', loudness);
    storeFeature('spectralCentroid', spectralCentroid);
    mfcc.forEach((v, i) => storeFeature(`mfcc${i}`, v));

    const loudnessAvg = getFeature('loudness');
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
    const colorIndex = Math.floor(mapParam('spectralCentroid', 'colorIndex', getFeature('spectralCentroid')));
    canvasContext.fillStyle = colors[colorIndex];
    canvasContext.fill();
  };
};
