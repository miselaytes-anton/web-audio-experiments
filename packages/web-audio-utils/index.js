const mergeParams = require('./mergeParams');
const CompositeAudioNode = require('./CompositeAudioNode');

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

module.exports = {
  mergeParams,
  CompositeAudioNode,
  getLiveAudio,
  getAudioBuffer
};
