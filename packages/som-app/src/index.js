import {createNote, getRandomParams} from './audio';
import {getCircleParams, isIntersect, setCanvasSize, getColor, drawCircle} from './canvas';

const audioCtx = new AudioContext();

const canvas = document.getElementById('the-canvas');
const canvasCtx = canvas.getContext('2d');

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
setCanvasSize(canvasCtx, WIDTH, HEIGHT);

const STATE = {
  selected: null,
  score: 0,
  circles: [],
  numCircles: 10,
  played: [],
  isWon: false,
};

for (var i = 0; i < STATE.numCircles; i++) {
  const c = getCircleParams(i, WIDTH, HEIGHT);
  c.audioParams = i < STATE.numCircles / 2 ? getRandomParams(i) : STATE.circles[i % (STATE.numCircles / 2)].audioParams;
  c.color = i < STATE.numCircles / 2 ? getColor(i) : STATE.circles[i % (STATE.numCircles / 2)].color;
  STATE.circles.push(c);
}

const draw = () => {
  window.requestAnimationFrame(() => {
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    for (let circle of STATE.circles) {
      drawCircle(canvasCtx, circle, STATE.selected && STATE.selected.i === circle.i);
    }
    canvasCtx.font = '30px Helvetica';
    canvasCtx.fillStyle = 'black';
    canvasCtx.fillText(`SCORE: ${STATE.score}`, WIDTH - 200, HEIGHT - 50);
    draw();
  });
};
draw();

const melody = (played) => {
  const start = played[0].currentTime;
  played.forEach(played => {
    const time = Math.ceil((played.currentTime - start) / 2);
    createNote(audioCtx, played.circle.audioParams, time);
    setTimeout(() => {
      played.circle.radius = played.circle.radius * 2;
    }, time * 1000);
  });
};

canvas.addEventListener('click', (e) => {
  const pos = {
    x: e.clientX,
    y: e.clientY
  };
  STATE.circles.forEach(circle => {
    if (isIntersect(pos, circle)) {
      createNote(audioCtx, circle.audioParams);
      if (STATE.isWon) {
        return;
      }
      STATE.played.push({currentTime: audioCtx.currentTime, circle: circle});
      if (!STATE.selected) {
        STATE.selected = circle;
      } else if(circle.audioParams.i === STATE.selected.audioParams.i && circle.i !== STATE.selected.i) {
        STATE.score += 5;
        circle.isFound = true;
        STATE.selected.isFound = true;
        STATE.selected = null;
        if (!STATE.circles.find(circle => circle.isFound === false)) {
          STATE.isWon = true;
          setTimeout(() => melody(STATE.played), 2000);
        }
      } else {
        STATE.score -= 1;
        STATE.selected = null;
      }
    }
  });
});
