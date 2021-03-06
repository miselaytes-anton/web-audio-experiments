import {mapParamRange, getFeatureStore, scale} from './utils';
import {setCanvasSize} from 'canvas-utils';

const featureRanges = {
  rms: [0, 1]
};

const {storeFeature, getFeature} = getFeatureStore(20);

export const draw = canvasContext => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  setCanvasSize(canvasContext, w, h);
  const scaleForHeight = scale(h);
  canvasContext.lineWidth = scaleForHeight(0.25);
  canvasContext.strokeStyle = 'rgba(255,255,255, 0.7)';
  const visualRanges = {
    lineLengthCoef: [0.5, 1.5].map(scaleForHeight),
    R: [20, 60].map(scaleForHeight),
    zigZagCoef: [0, 50].map(scaleForHeight),
    gradRad1: [0, 500]
  };

  const mapParam = mapParamRange(featureRanges, visualRanges);
  const numFrequencyBins = 128;

  return features => {
    if (features === null) {
      return;
    }
    const {frequencyData, rms} = features;

    storeFeature('rms', rms);
    const rmsAvg = getFeature('rms');
    const numLines = numFrequencyBins * 2;
    const angleStep = 2 * Math.PI / (numLines);
    const lineLengthCoef = mapParam('rms', 'lineLengthCoef', rmsAvg);
    const zigZagCoef = mapParam('rms', 'zigZagCoef', rmsAvg);
    const gradRad1 = mapParam('rms', 'gradRad1', rmsAvg ** 0.5);
    const gradRad2 = 500;
    const R = mapParam('rms', 'R', rmsAvg);
    const numLineParts = 10;
    const circleCenter = {
      x: w / 2,
      y: h / 2 - 20
    };
    const gradient = canvasContext.createRadialGradient(
      circleCenter.x,
      circleCenter.y,
      gradRad1,
      circleCenter.x,
      circleCenter.y,
      gradRad2
    );
    gradient.addColorStop(0, 'rgba(92,37,141,1)');
    gradient.addColorStop(1, 'rgba(67,137,162,1)');
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, w, h);
    canvasContext.beginPath();

    for (let lineIndex = 0; lineIndex < numLines; lineIndex++) {
      //reflect in the middle
      const frequencyBinIndex = lineIndex < numFrequencyBins ? lineIndex : numFrequencyBins - lineIndex % numFrequencyBins;
      const v = Math.abs(frequencyData[frequencyBinIndex]) * lineLengthCoef;
      const coords = [];
      let direction = lineIndex % 2 === 0 ? 1 : -1;
      const startCoord = [
        circleCenter.x + Math.sin(angleStep * lineIndex) * R,
        circleCenter.y + Math.cos(angleStep * lineIndex) * R
      ];
      for (let linePartIndex = 0; linePartIndex < numLineParts; linePartIndex++) {
        const start = linePartIndex === 0
          ? startCoord
          : coords[linePartIndex - 1];
        direction *= -1;
        coords.push([
          start[0] + Math.sin(angleStep * (lineIndex + direction * zigZagCoef)) * v / numLineParts,
          start[1] + Math.cos(angleStep * (lineIndex + direction * zigZagCoef)) * v / numLineParts
        ]);
      }
      canvasContext.moveTo(...startCoord);
      coords.forEach(([x, y]) => {
        canvasContext.lineTo(x, y);
      });
    }

    canvasContext.stroke();
  };
};
