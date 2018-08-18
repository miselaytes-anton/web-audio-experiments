'use strict';

const {mapValues} = require('lodash');
const VirtualAudioGraph = require('virtual-audio-graph');

const makeDistortionCurve = (amount) => {
  const nSamples = 44100;
  const curve = new Float32Array(nSamples);
  const deg = Math.PI / 180;
  let i;
  let x;
  for (i = 0; i < nSamples; ++i) {
    x = i * 2 / nSamples - 1;
    curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

const getGuitarSoundBuffer = (audioCtx) => {
  return fetch('guitar.wav')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer));
};

const stateToGraph = (state) => mapValues(state, value => {
  const [nodeName, output, opts] = value;
  const node = VirtualAudioGraph[nodeName];
  return node(output, opts);
});

module.exports = {makeDistortionCurve, getGuitarSoundBuffer, stateToGraph}
