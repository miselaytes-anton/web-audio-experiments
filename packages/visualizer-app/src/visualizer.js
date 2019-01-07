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
  R: [5, 20],
  zigZagK: [0, 100]
};

const mapParamRange = (feature, shape, v) => mapRange(featureRanges[feature], shapeRanges[shape], v);

const draw = canvasContext => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvasContext.canvas.width = w;
  canvasContext.canvas.height = h;
  canvasContext.lineWidth = 0.5;
  canvasContext.strokeStyle = `rgba(255,255,255, 1)`;

  return features => {
    if (features === null) {
      return;
    }
    logTimes(features, 10);

    const {frequencyData, rms} = features;
    canvasContext.beginPath();
    canvasContext.clearRect(0, 0, w, h);

    const bufferLength = frequencyData.length;
    const scalingCoef = 1.5;
    const angleStep = 2 * Math.PI / bufferLength;
    const zigZagK = mapParamRange('rms', 'zigZagK', rms);
    const R = 100;
    const numLineParts = 10;
    const circleCenter = {
      x: w / 2,
      y: h / 2 + 40
    };

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
          start[0] + Math.sin(angleStep * (i + direction * zigZagK)) * v / numLineParts,
          start[1] + Math.cos(angleStep * (i + direction * zigZagK)) * v / numLineParts
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
