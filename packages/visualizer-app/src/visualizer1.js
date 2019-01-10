import {getLogger, mapParamRange} from './utils';

const featureRanges = {
  rms: [0, 1],
  energy: [-100, -30]
};
const visualRanges = {
  R: [100, 400],
  color: [0, 255]
};

export const draw = canvasContext => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvasContext.canvas.width = w;
  canvasContext.canvas.height = h;
  const mapParam = mapParamRange(featureRanges, visualRanges);
  const logTimes = getLogger();

  return features => {
    if (features === null) {
      return;
    }
    const {energySpread, rms} = features;
    const circleCenter = {
      x: w / 2,
      y: h / 2
    };
    const red = Math.floor(mapParam('energy', 'color', (energySpread.bass + energySpread.lowMid) / 2));
    const green = Math.floor(mapParam('energy', 'color', energySpread.mid));
    const blue = Math.floor(mapParam('energy', 'color', (energySpread.highMid + energySpread.treble) / 2));
    const R = mapParam('rms', 'R', rms ** 0.5);

    canvasContext.fillStyle = `rgba(${red},${green},${blue},1)`;
    logTimes({red, green, blue, energySpread}, 10);

    canvasContext.clearRect(0, 0, w, h);
    canvasContext.beginPath();
    canvasContext.arc(circleCenter.x, circleCenter.y, R, 0, 2 * Math.PI);
    canvasContext.fill();
  };
};
