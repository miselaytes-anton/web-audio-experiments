export const getRatio = (canvasContext) => {
  const dpr = window.devicePixelRatio || 1;
  const bsr = canvasContext.webkitBackingStorePixelRatio ||
        canvasContext.mozBackingStorePixelRatio ||
        canvasContext.msBackingStorePixelRatio ||
        canvasContext.oBackingStorePixelRatio ||
        canvasContext.backingStorePixelRatio || 1;

  return dpr / bsr;
};
export const setCanvasSize = (canvasContext, W, H) => {
  const ratio = getRatio(canvasContext);
  canvasContext.canvas.width = W * ratio;
  canvasContext.canvas.height = H * ratio;
  canvasContext.canvas.style.width = W + 'px';
  canvasContext.canvas.style.height = H + 'px';
  canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);
};
