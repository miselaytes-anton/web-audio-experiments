
const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
};

// const genB = document.getElementById('gen');
// const initB = document.getElementById('init');

const ctx = new AudioContext();

const getRandomOscType = () => {
  const types = ['sine', 'square', 'sawtooth', 'triangle'];
  return types[getRandomInt(0, 4)];
};

const getRandomParams = (i) => {
  const freq = getRandomInt(100, 1000);
  const offset = 0;
  const filterFreq = freq * getRandomArbitrary(0.5, 2);
  const attack = getRandomArbitrary(0.01, 0.5);
  const decay = getRandomArbitrary(0.01, 0.5);
  const sustain = getRandomArbitrary(0.01, 0.5);
  const release = getRandomArbitrary(0.01, 0.5);
  const mod1Type = getRandomOscType();
  const mod2Type = getRandomOscType();
  const oscType = getRandomOscType();
  const mod1Detune = Math.random() * 300;
  const mod2Detune = Math.random() * 300;
  return {i, freq, offset, filterFreq, attack, decay, sustain, release, mod1Type, mod2Type, oscType, mod1Detune, mod2Detune};
};
var createNote = function({freq, offset, filterFreq, attack, decay, sustain, release, mod1Type, mod2Type, oscType, mod1Detune, mod2Detune}) {

  // timing vars
  var start = ctx.currentTime + (offset || 0);
  // create audio nodes
  var mod1 = ctx.createOscillator();
  var mod1Gain = ctx.createGain();
  var mod2 = ctx.createOscillator();
  var mod2Gain = ctx.createGain();
  var osc = ctx.createOscillator();
  var env = ctx.createGain();
  var filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
  filter.gain.setValueAtTime(25, ctx.currentTime);

  // mod settings
  mod1.frequency.value = freq * 0.5;
  mod1.type = mod1Type;
  mod1.detune = mod1Detune;
  mod1Gain.gain.value = freq / 3;

  mod2.frequency.value = freq * 0.25;
  mod2.type = mod2Type;
  mod2.detune = mod2Detune;

  // oscillator settings
  osc.frequency.value = freq;
  osc.type = oscType;

  // route audio
  mod1.connect(mod1Gain);
  mod2.connect(mod2Gain);
  mod1Gain.connect(osc.frequency);
  mod2Gain.connect(osc.detune);
  osc.connect(env);
  env.connect(filter);
  filter.connect(ctx.destination);

  // use timed volume control as envelope
  env.gain.value = 0;
  env.gain.linearRampToValueAtTime(0.0, start);
  env.gain.linearRampToValueAtTime(1.0, start + attack);
  env.gain.linearRampToValueAtTime(0.8, start + attack + decay);
  env.gain.linearRampToValueAtTime(0.6, start + attack + decay + sustain);
  env.gain.linearRampToValueAtTime(0.0, start + attack + decay + sustain + release);

  // play note
  mod1.start(start);
  mod2.start(start);
  osc.start(start);

};

const canvas = document.getElementById('the-canvas');
const ctx2 = canvas.getContext('2d');

const WIDTH = 1000;
const HEIGHT = 500;

const getColor = (i) =>{
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

const getCircleParams = (i) => {
  const x = getRandomInt(0 + 50, WIDTH - 50);
  const y = getRandomInt(0 + 50, HEIGHT - 50);
  const radius = 30;
  return {x, y, radius, i};
};
let selected;
const drawCircle = ({x, y, radius, isFound, i, color}) => {
  ctx2.fillStyle = isFound ? color : selected && i === selected.i ? 'black' : 'grey';
  ctx2.beginPath();
  ctx2.arc(x, y, radius, 0, 2 * Math.PI);
  ctx2.fill();
};

const circles = [];
const numCircles = 10;
for (var i = 0; i < numCircles; i++) {
  const c = getCircleParams(i);
  c.audioParams = i < numCircles / 2 ? getRandomParams(i) : circles[i % (numCircles / 2)].audioParams;
  c.color = i < numCircles / 2 ? getColor(i) : circles[i % (numCircles / 2)].color;
  circles.push(c);
}

const draw = () => {
  window.requestAnimationFrame(() => {
    for (let circle of circles) {
      drawCircle(circle);
    }
    draw();
  });
};
draw();

canvas.addEventListener('click', (e) => {
  const pos = {
    x: e.clientX,
    y: e.clientY
  };
  circles.forEach(circle => {
    if (isIntersect(pos, circle)) {
      if (!selected) {
        selected = circle;
      } else if(circle.audioParams.i === selected.audioParams.i) {
        circle.isFound = true;
        selected.isFound = true;
        selected = undefined;
      } else {
        selected = undefined;
      }
      createNote(circle.audioParams);
    }
  });
});
