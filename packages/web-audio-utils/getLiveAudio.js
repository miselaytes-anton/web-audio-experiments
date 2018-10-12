const getLiveAudio = (audioCtx) => navigator.mediaDevices.getUserMedia({audio: {
  autoGainControl: false,
  echoCancellation: false,
  noiseSuppression: false,
}})
.then(stream => audioCtx.createMediaStreamSource(stream));

module.exports = getLiveAudio;
