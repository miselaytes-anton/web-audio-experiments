'use strict';

const getLiveAudio = (audioCtx) => navigator.mediaDevices.getUserMedia({audio: true})
.then(stream => audioCtx.createMediaStreamSource(stream));

module.exports = getLiveAudio;
