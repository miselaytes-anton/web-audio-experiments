const Freeverb = require('freeverb');
const {getLiveAudio} = require('web-audio-utils');
const initUi = require('./ui').init;
const defaults = {dampening: 3000, roomSize: 0.7, dryGain: 0.2, wetGain: 0.8};
const audioCtx = new AudioContext();

const getMasterGain = (audioCtx) => {
  const masterGain = audioCtx.createGain();
  //a safety measure
  masterGain.gain.value = 0.7;
  masterGain.connect(audioCtx.destination);

  return masterGain;
};

const master = getMasterGain(audioCtx);
const freeverb = new Freeverb(audioCtx, defaults);

getLiveAudio(audioCtx).then(liveIn => {
  liveIn
  .connect(freeverb)
  .connect(master);
  initUi(freeverb, defaults);
});

const turnon = () => {
  audioCtx.resume();
};

module.exports = {turnon};
