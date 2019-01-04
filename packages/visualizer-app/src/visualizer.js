const mapRange = (fromRange, toRange, number) =>
  (number - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];
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
  circlePosition: [10, 40],
  scalingCoef: [1.8, 3],
  R: [5, 20]
};

const mapParamRange = (feature, shape, v) => mapRange(featureRanges[feature], shapeRanges[shape], v);

const draw = canvasContext => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvasContext.canvas.width = w;
  canvasContext.canvas.height = h;

  return features => {
    if (features === null) {
      return;
    }
    const {frequencyData, rms} = features;
    logTimes(features, 10);

    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = `rgba(255,255,255, 1)`;
    canvasContext.beginPath();
    canvasContext.clearRect(0, 0, w, h);

    const bufferLength = frequencyData.length;
    const scalingCoef = 2 || mapParamRange('rms', 'scalingCoef', rms);
    const angleStep = 2 * Math.PI / bufferLength;
    const R = mapParamRange('rms', 'R', rms);
    const circleCenter = {
      x: w / 2,
      y: h / 2 - 80
    };

    for (let i = 0; i < bufferLength; i++) {
      //reflect in the middle
      const index = i < bufferLength / 2 ? i : bufferLength - i;
      //take every even bar
      const v = frequencyData[index] * scalingCoef;
      const x = circleCenter.x + Math.sin(angleStep * i) * (R + v);
      const y = circleCenter.y + Math.cos(angleStep * i) * (R + v);
      canvasContext.moveTo(circleCenter.x, circleCenter.y);
      canvasContext.lineTo(x, y);
    }

    canvasContext.stroke();
  };
};

module.exports = {draw};
