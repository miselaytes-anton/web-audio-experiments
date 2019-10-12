
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// const genB = document.getElementById('gen');
const initB = document.getElementById('init');

let ctx;

const getRandomOscType = () => {
  const types = ['sine', 'square', 'sawtooth', 'triangle'];
  return types[getRandomInt(0, 4)];
};

var createNote = function(freq, offset) {
  // envleope vars
  var attack = getRandomArbitrary(0.01, 0.5);
  var decay = getRandomArbitrary(0.01, 0.5);
  var sustain = getRandomArbitrary(0.01, 0.5);
  var release = getRandomArbitrary(0.01, 0.5);
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
  filter.frequency.setValueAtTime(freq * getRandomArbitrary(0.5, 2), ctx.currentTime);
  filter.gain.setValueAtTime(25, ctx.currentTime);

  // mod settings
  mod1.frequency.value = freq * 0.5;
  mod1.type = getRandomOscType();
  mod1.detune = Math.random() * 300;
  mod1Gain.gain.value = freq / 3;

  mod2.frequency.value = freq * 0.25;
  mod2.type = getRandomOscType();
  mod2.detune = Math.random() * 300;

  // oscillator settings
  osc.frequency.value = freq;
  osc.type = getRandomOscType();

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
const generate = () => {
  if(!ctx) {
    ctx = new AudioContext();
  }
  const rand = getRandomInt(100, 1000);
  createNote(rand);
};

initB.addEventListener('click', generate);

