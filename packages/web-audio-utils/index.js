const tracks = require('./tracks');
const sample = require('lodash.sample');
const mergeParams = require('./mergeParams');
const CompositeAudioNode = require('./CompositeAudioNode');
const getRandomTrack = () => `https://amiselaytes.com/lomax/audio/${sample(tracks)}.mp3`;

const getAudioBuffer = (audioCtx, url) => {
  return fetch(url)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer));
};

const getLiveAudio = (audioCtx) => navigator.mediaDevices.getUserMedia({audio: {
  autoGainControl: false,
  echoCancellation: false,
  noiseSuppression: false,
}})
.then(stream => audioCtx.createMediaStreamSource(stream));

const getAudioContext = () => {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  return Ctx ? new Ctx() : null;
};

module.exports = {
  mergeParams,
  CompositeAudioNode,
  getLiveAudio,
  getAudioBuffer,
  getRandomTrack,
  getAudioContext,
};
