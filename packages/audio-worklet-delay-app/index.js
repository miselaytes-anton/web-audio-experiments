'use strict';

//https://googlechromelabs.github.io/web-audio-samples/audio-worklet/
const {getLiveAudio} = require('web-audio-utils');
const audioCtx = new AudioContext();
audioCtx.audioWorklet.addModule('reverb-processor.js')
.then(() => getLiveAudio(audioCtx))
.then((liveIn) => {
  // After the resolution of module loading, an AudioWorkletNode can be
  // constructed.
  let reverbWorkletNode = new AudioWorkletNode(audioCtx, 'reverb-processor');

  // AudioWorkletNode can be interoperable with other native AudioNodes.
  liveIn.connect(reverbWorkletNode).connect(audioCtx.destination);

})
.catch(e => console.error(e));
