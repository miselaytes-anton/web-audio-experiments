const mapRange = (fromRange, toRange, number) =>
  (number - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];
const sum = arr => arr.reduce((sum, curr) => sum + curr, 0);
const avg = arr => sum(arr) / arr.length;
let logged = 0;
const logTimes = (msg, times) => {
  if (logged < times) {
    console.log(msg);
    logged = logged + 1;
  }
};
const featureRanges = {
  rms: [0, 1]
};
const shapeRanges = {
  scalingCoef: [1.5, 2.5],
  R: [70, 120],
  zigZagCoef: [0, 100],
  gradRad: [0, 500]
};
const mapParamRange = (feature, shape, v) => mapRange(featureRanges[feature], shapeRanges[shape], v);

const previousFeatures = {};
const storeFeature = (featureName, featureValue) => {
  const numStoredFeatures = 20;
  if (!previousFeatures[featureName]) {
    previousFeatures[featureName] = [];
  }
  previousFeatures[featureName].push(featureValue);
  if (previousFeatures[featureName].length > numStoredFeatures) {
    previousFeatures[featureName].shift();
  }
};
const getFeature = name => avg(previousFeatures[name]);

const draw = canvasContext => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvasContext.canvas.width = w;
  canvasContext.canvas.height = h;
  canvasContext.lineWidth = 0.7;
  canvasContext.strokeStyle = `rgba(255,255,255, 0.7)`;

  return features => {
    if (features === null) {
      return;
    }
    logTimes(features, 10);

    const {frequencyData, rms} = features;
    storeFeature('rms', rms);
    const rmsAvg = getFeature('rms');
    const bufferLength = frequencyData.length;
    const angleStep = 2 * Math.PI / bufferLength;

    const scalingCoef = mapParamRange('rms', 'scalingCoef', rmsAvg);
    const zigZagCoef = mapParamRange('rms', 'zigZagCoef', rmsAvg);
    const gradRad = mapParamRange('rms', 'gradRad', rmsAvg ** 0.5);
    const R = mapParamRange('rms', 'R', rmsAvg);
    const numLineParts = 10;
    const circleCenter = {
      x: w / 2,
      y: h / 2 + 50
    };
    const gradient = canvasContext.createRadialGradient(
      circleCenter.x,
      circleCenter.y,
      gradRad,
      circleCenter.x,
      circleCenter.y,
      500
    );
    gradient.addColorStop(0, 'rgba(92,37,141,1)');
    gradient.addColorStop(1, 'rgba(67,137,162,1)');
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(0, 0, w, h);
    canvasContext.beginPath();

    for (let i = 0; i < bufferLength; i++) {
      //reflect in the middle
      const index = i < bufferLength / 2 ? i : bufferLength - i;
      const v = Math.abs(frequencyData[index]) * scalingCoef;
      const coords = [];
      let direction = i % 2 === 0 ? 1 : -1;
      const startCoord = [
        circleCenter.x + Math.sin(angleStep * i) * R,
        circleCenter.y + Math.cos(angleStep * i) * R
      ];
      for (let lineIndex = 0; lineIndex < numLineParts; lineIndex++) {
        const start = lineIndex === 0
          ? startCoord
          : coords[lineIndex - 1];
        direction *= -1;
        coords.push([
          start[0] + Math.sin(angleStep * (i + direction * zigZagCoef)) * v / numLineParts,
          start[1] + Math.cos(angleStep * (i + direction * zigZagCoef)) * v / numLineParts
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

module.exports = {draw};
