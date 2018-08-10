'use strict';

const {default: createVirtualAudioGraph} = require('virtual-audio-graph');
const {makeDistortionCurve, getGuitarSoundBuffer, stateToGraph} = require('./utils');
const {setState, subscribe} = require('./state')

const audioContext = new AudioContext();

const virtualAudioGraph = createVirtualAudioGraph({
  audioContext,
  output: audioContext.destination,
});

subscribe(state => {
  virtualAudioGraph.update(stateToGraph(state));
})

getGuitarSoundBuffer(audioContext)
.then(buffer => {

  setState({
    volume: ['gain', 'output', {gain: 0.5}],
    distortion: ['waveShaper', 'volume', {curve: makeDistortionCurve(400), oversample: '4x'}],
    guitar: ['bufferSource', 'distortion', {buffer, loop: true}],
  });
});

// UI
const volumeControl = document.querySelector('#volumeControl');
volumeControl.addEventListener('input', () => {
  setState({
    volume: ['gain', 'output', {gain: parseFloat(volumeControl.value)}]
  });
}, false);

