import {playNote, getRandomParams, createContext, getScale} from './audio';
import {getCircleParams, isIntersect, drawCircle, setCanvasSize, clearCanvas, showScore, showScaleName, getColor} from './canvas';

const canvas = document.getElementById('the-canvas');
const canvasCtx = canvas.getContext('2d');

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
setCanvasSize(canvasCtx, WIDTH, HEIGHT);

const STATE = {
  selected: null,
  score: 0,
  circles: [],
  played: [],
  isWon: false,
  audio: {ctx: null, reverb: null},
  scale: getScale(),
};
console.log(STATE.scale);

const notes = STATE.scale.notes.map(({freq, name}, i) => ({
  name,
  audioParams: {...getRandomParams(freq), id: i},
}));
STATE.circles = [...notes, ...notes].map((note, i) => ({
  ...getCircleParams(i, WIDTH, HEIGHT),
  ...note,
  color: getColor(note.audioParams.id),
  isFound: false
}));

let frame = 0;
const draw = () => {
  window.requestAnimationFrame(() => {
    frame++;
    clearCanvas(canvasCtx, WIDTH, HEIGHT);
    for (let circle of STATE.circles) {
      drawCircle(canvasCtx, circle, STATE.selected && STATE.selected.id === circle.id);
    }
    showScore(canvasCtx, WIDTH, HEIGHT, STATE.score);
    showScaleName(canvasCtx, WIDTH, HEIGHT, STATE.scale.scale, frame);
    draw();
  });
};
draw();

const won = (played) => {
  const start = played[0].currentTime;
  played.forEach(played => {
    const offset = Math.ceil((played.currentTime - start) / 4);
    playNote(STATE.audio, {...played.circle.audioParams, offset});
    setTimeout(() => {
      if(played.circle.radius < HEIGHT / 2) {
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
