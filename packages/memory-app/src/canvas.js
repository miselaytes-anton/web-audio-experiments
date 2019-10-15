import {getRandomInt} from './utils';

const FONT_FAMILY = 'Acme';

const getColor = (i) => {
  const colors = [
    'rgba(253, 197, 245, 0.8)',
    'rgba(247, 174, 248, 0.8)',
    'rgba(179, 136, 235, 0.8)',
    'rgba(128, 147, 241, 0.8)',
    'rgba(133, 224, 247, 0.8)',
  ];
  return colors[i % colors.length];
};

const isIntersect = (point, circle) => {
  const dist = Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2);
  return dist < circle.radius;
};

const getCircleParams = (id, width, height) => {
  const x = getRandomInt(0 + 50, width - 50);
  const y = getRandomInt(0 + 50, height - 50);
  const radius = 35;
  return {x, y, radius, id};
};

const drawCircle = (canvasContext, {x, y, radius, isFound, color, name}, isSelected) => {
  canvasContext.fillStyle = isFound ? color : isSelected ? 'black' : 'grey';
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
  canvasContext.fill();

  if (isFound) {
    canvasContext.font = `30px ${FONT_FAMILY}`;
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(name, x - canvasContext.measureText(name).width / 2, y + 8);
  }
};

const clearCanvas = (canvasContext, w, h) => {
  canvasContext.fillStyle = 'rgba(255,255,255,0.8)';
  canvasContext.fillRect(0, 0, w, h);
};

const showScore = (canvasContext, w, h, score) => {
  canvasContext.font = `40px ${FONT_FAMILY}`;
  canvasContext.fillStyle = 'black';
  canvasContext.fillText(`Score: ${score}`, w - 200, h - 50);
};

const showScaleName = (canvasContext, w, h, score, frame) => {
  canvasContext.font = `120px ${FONT_FAMILY}`;
  const opacity = Math.max(1 - frame * 0.005, 0);
  canvasContext.fillStyle = `rgb(50,50,50, ${opacity})`;
  canvasContext.fillText(score, (w - canvasContext.measureText(score).width) / 2, h / 2);
};

const getRatio = (canvasContext) => {
  const dpr = window.devicePixelRatio || 1;
  const bsr = canvasContext.webkitBackingStorePixelRatio ||
    canvasContext.mozBackingStorePixelRatio ||
    canvasContext.msBackingStorePixelRatio ||
    canvasContext.oBackingStorePixelRatio ||
    canvasContext.backingStorePixelRatio || 1;

  return dpr / bsr;
};
const setCanvasSize = (canvasContext, W, H) => {
  const ratio = getRatio(canvasContext);
  canvasContext.canvas.width = W * ratio;
  canvasContext.canvas.height = H * ratio;
  canvasContext.canvas.style.width = W + 'px';
  canvasContext.canvas.style.height = H + 'px';
  canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);
};

export {getCircleParams, isIntersect, getColor, drawCircle, setCanvasSize, clearCanvas, showScore, showScaleName};
