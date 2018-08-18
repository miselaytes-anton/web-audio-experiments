'use strict';

const {makeDistortionCurve} = require('./utils');

const init = store => {
  const volumeControl = document.querySelector('#volumeControl');
  volumeControl.addEventListener('input', () => {
    store.dispatch({
      type: 'SET_VOLUME',
      node: ['gain', 'output', {gain: parseFloat(volumeControl.value)}]
    });
  }, false);

  const distortionControl = document.querySelector('#distortionControl');
  distortionControl.addEventListener('input', () => {
    const curve = makeDistortionCurve(parseInt(distortionControl.value, 10))
    store.dispatch({
      type: 'SET_DISTORTION',
      node: ['waveShaper', 'volume', {curve, oversample: '4x'}]
    });
  }, false);
};

module.exports = {init};
