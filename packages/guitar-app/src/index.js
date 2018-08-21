'use strict';

const {createStore} = require('redux');
const {isEmpty} = require('lodash')
const {default: createVirtualAudioGraph} = require('virtual-audio-graph');
const {makeDistortionCurve, getGuitarSoundBuffer, stateToGraph} = require('./utils');
const reducer = require('./reducer')
const ui = require('./ui')

const audioContext = new AudioContext();

const virtualAudioGraph = createVirtualAudioGraph({
  audioContext,
  output: audioContext.destination,
});

// update using virtualAudioGraph
const updateAudioNodes = state => virtualAudioGraph.update(stateToGraph(state));

// update using plain Web Audio API
const nodes = {};
const updateAudioNodes2 = state => {
  if (isEmpty(nodes)) {
    // creating nodes
    nodes.volume = audioContext.createGain();
    nodes.distortion = audioContext.createWaveShaper();
    nodes.distortion.oversample = state.distortion[2].oversample;
    nodes.guitar = audioContext.createBufferSource();
    nodes.guitar.buffer = state.guitar[2].buffer;
    nodes.guitar.loop = state.guitar[2].loop;
    nodes.guitar.start();

    // connecting nodes
    nodes.guitar.connect(nodes.distortion);
    nodes.distortion.connect(nodes.volume);
    nodes.volume.connect(audioContext.destination);
  }

  // updating params
  nodes.volume.gain.value = state.volume[2].gain;
  nodes.distortion.curve = state.distortion[2].curve;
}

getGuitarSoundBuffer(audioContext)
.then(buffer => {
  // we start with 0 distortion
  const curve = makeDistortionCurve(0)
  const initialState = {
    // we start with 0 volume
    volume: ['gain', 'output', {gain: 0}],
    distortion: ['waveShaper', 'volume', {curve, oversample: '4x'}],
    guitar: ['bufferSource', 'distortion', {buffer, loop: true}],
  };

  const store = createStore(reducer, initialState);
  store.subscribe(() => updateAudioNodes(store.getState()))

  ui.init(store);
});
