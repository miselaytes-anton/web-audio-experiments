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

const declarativeUpdate = state => {
  virtualAudioGraph.update(stateToGraph(state));
};

const nodes = {};
const imperativeUpdate = state => {
  if (isEmpty(nodes)) {
    nodes.volume = audioContext.createGain();
    nodes.distortion = audioContext.createWaveShaper();
    nodes.distortion.oversample = state.distortion[2].oversample;
    nodes.guitar = audioContext.createBufferSource();
    nodes.guitar.buffer = state.guitar[2].buffer;
    nodes.guitar.loop = state.guitar[2].loop;
    nodes.guitar.start();
  }

  // connecting the nodes
  // but actually we also need to check if new ones were added or old ones removed
  nodes.guitar.connect(nodes.distortion);
  nodes.distortion.connect(nodes.volume);
  nodes.volume.connect(audioContext.destination);

  // setting the values
  // but actually there is a lot of things we would need to check here
  nodes.volume.gain.value = state.volume[2].gain;
  nodes.distortion.curve = state.distortion[2].curve;
}

getGuitarSoundBuffer(audioContext)
.then(buffer => {

  const initialState = {
    volume: ['gain', 'output', {gain: 0.5}],
    distortion: ['waveShaper', 'volume', {curve: makeDistortionCurve(0), oversample: '4x'}],
    guitar: ['bufferSource', 'distortion', {buffer, loop: true}],
  };

  const store = createStore(reducer, initialState);

  //store.subscribe(() => declarativeUpdate(store.getState()))
  store.subscribe(() => imperativeUpdate(store.getState()))

  ui.init(store);
});
