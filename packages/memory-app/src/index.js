import {playNote, getRandomParams, createContext, getScale} from './audio';
import {getCircleParams, isIntersect, drawCircle, setCanvasSize, clearCanvas, showScore} from './canvas';

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
  audio: {ctx: null, reverb: null},
};
STATE.scale = getScale(STATE.numCircles);
console.log(STATE.scale);

const notes = STATE.scale.notes.slice(0, STATE.numCircles / 2).map(({freq, name}) => ({
  name,
  audioParams: getRandomParams(freq),
}));
STATE.circles = [...notes, ...notes].map((note, i) => ({
  ...getCircleParams(i, WIDTH, HEIGHT),
  ...note,
}));

const draw = () => {
  window.requestAnimationFrame(() => {
    clearCanvas(canvasCtx, WIDTH, HEIGHT);
    for (let circle of STATE.circles) {
      drawCircle(canvasCtx, circle, STATE.selected && STATE.selected.id === circle.id);
    }
    showScore(canvasCtx, WIDTH, HEIGHT, STATE.score);
    draw();
  });
};
draw();

const won = (played) => {
  const start = played[0].currentTime;
  played.forEach(played => {
    const offset = Math.ceil((played.currentTime - start) / 2);
    playNote(STATE.audio, {...played.circle.audioParams, offset});
    setTimeout(() => {
      if(played.circle.radius < WIDTH) {
        played.circle.radius = played.circle.radius * 2;
      }
    }, offset * 1000);
  });
};

const gameIsFinished = () => !STATE.circles.find(circle => circle.isFound === false);

canvas.addEventListener('click', (e) => {
  if (!STATE.audio.ctx) {
    // audio context can only be created after first user interaction
    STATE.audio = createContext();
  }
  const pos = {
    x: e.clientX,
    y: e.clientY
  };
  STATE.circles.forEach(circle => {
    if (!isIntersect(pos, circle)) {
      return;
    }
    playNote(STATE.audio, circle.audioParams);
    if (gameIsFinished()) {
      return;
    }
    STATE.played.push({currentTime: STATE.audio.ctx.currentTime, circle});

    if (!STATE.selected) {
      STATE.selected = circle;
    } else if (circle.audioParams.id === STATE.selected.audioParams.id && circle.id !== STATE.selected.id) {
      STATE.score += 5;
      circle.isFound = true;
      STATE.selected.isFound = true;
      STATE.selected = null;
      if (gameIsFinished()) {
        setTimeout(() => won(STATE.played), 2000);
      }
    } else {
      STATE.score -= 1;
      STATE.selected = null;
    }
  });
});
