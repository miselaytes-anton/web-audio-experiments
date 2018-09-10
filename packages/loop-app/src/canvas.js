const {mapRange} = require('./util');

const canvas = document.getElementById('the-canvas');
const ctx = canvas.getContext('2d');
const getColor = (i) =>{
  const color1 = 'rgba(52, 89, 149, 0.8)';
  const color2 = 'rgba(3, 206, 164, 0.8)';
  const color3 = 'rgba(255, 159, 28, 0.8)';
  const color4 = 'rgba(251, 77, 61, 0.8)';
  const color5 = 'rgba(202, 21, 81, 0.8)';

  const colors = [color1, color2, color3, color4, color5];
  return colors[i % colors.length];
};

const BLACK = 'black';
const WIDTH = 500;
const HEIGHT = 500;
const RADIUS = 10;
const TRACK_WEIGHT = 20;
const EMPTY_WEIGHT = 20;
const LINE_LENGTH = 500;

const base = () => {
  ctx.fillStyle = getColor(0);
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, RADIUS, 0, 2 * Math.PI);
  ctx.fill();
};

const track = (trackNum, start, end) => {
  ctx.strokeStyle = getColor(trackNum + 1);
  ctx.lineWidth = TRACK_WEIGHT;
  // "butt" || "round" || "square"
  //ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, RADIUS + (trackNum + 2) * EMPTY_WEIGHT + trackNum * TRACK_WEIGHT, start, end);
  ctx.stroke();
  ctx.closePath();
};

const line = (x1, y1, x2, y2) => {
  ctx.save();
  ctx.strokeStyle = BLACK;
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = 1;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

const draw = (state) => {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  base();
  const from = [0, state.loopLength];
  const to = [-Math.PI / 2, 1.5 * Math.PI];
  state.tracks.forEach((tr, i) => {
    const start = mapRange(from, to, tr.start);
    const end = mapRange(from, to, tr.end !== undefined ? tr.end : state.currentPosition);
    track(i, start, end);
  });
  const angle = mapRange(from, to, state.currentPosition);

  line(WIDTH / 2, HEIGHT / 2, WIDTH / 2 + Math.cos(angle) * LINE_LENGTH / 2, HEIGHT / 2 + Math.sin(angle) * LINE_LENGTH / 2);
};

module.exports = {draw};
