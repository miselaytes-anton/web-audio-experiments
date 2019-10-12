import {getRandomInt} from './utils';

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

const isIntersect = (point, circle) => {
    const dist = Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2);
    return dist < circle.radius;
};

const getCircleParams = (i, width, height) => {
    const x = getRandomInt(0 + 50, width - 50);
    const y = getRandomInt(0 + 50, height - 50);
    const radius = 30;
    return {x, y, radius, i, isFound: false};
};

const drawCircle = (ctx2, {x, y, radius, isFound, color}, isSelected) => {
    ctx2.fillStyle = isFound ? color : isSelected ? 'black' : 'grey';
    ctx2.beginPath();
    ctx2.arc(x, y, radius, 0, 2 * Math.PI);
    ctx2.fill();
  };

export {getCircleParams, isIntersect, setCanvasSize, getRatio, getColor, drawCircle};