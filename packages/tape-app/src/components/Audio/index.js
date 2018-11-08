import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getAudioBuffer} from 'web-audio-utils';
import {mapRange} from '../../util';
import {audioBufferLoaded} from '../../actions';
import poem from '../../audio/poem.mp3';

import createVirtualAudioGraph, {
  delay,
  gain,
  bufferSource,
  biquadFilter
} from 'virtual-audio-graph';

const normFeedback = value => value / 20;
const normDelay = (reader1Position) => mapRange([0, 20], [0, 1], reader1Position);
const normSpeed = tapeSpeed => tapeSpeed <= 10
    ? mapRange([0, 10], [0, 1], tapeSpeed)
    : mapRange([10, 20], [1, 10], tapeSpeed);
const normDry = mix => mapRange([0, 20], [1, 0], mix);
const normWet = mix => mapRange([0, 20], [0, 1], mix);
const normFrequency = lowpass => mapRange([0, 20], [16, 8000], lowpass);
const paramsToGraph = ({tapeSpeed, feedbackAmount, reader1Position, audioBuffer, mix, lowpass}) => {
  return {
    master: gain('output', {gain: 0.7}),
    dry: gain('master', {gain: normDry(mix)}),
    wet: gain('master', {gain: normWet(mix)}),
    feedback: gain(['delay'], {gain: normFeedback(feedbackAmount)}),
    lowpass: biquadFilter(['feedback', 'wet'], {type: 'lowpass', frequency: normFrequency(lowpass)}),
    delay: delay('lowpass', {delayTime: normDelay(reader1Position)}),
    bufferSource: bufferSource(['delay', 'dry'], {buffer: audioBuffer, loop: true, playbackRate: normSpeed(tapeSpeed)})
  };
};

const audioContext = new AudioContext();
const virtualAudioGraph = createVirtualAudioGraph({
  audioContext,
  output: audioContext.destination,
});

class Audio extends Component {
  static propTypes = {
    loadAudioSource: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.loadAudioSource(audioContext, poem);
  }

  render() {
    virtualAudioGraph.update(paramsToGraph(this.props));
    return null;
  }
}

export default connect(
  state => state,
  dispatch => ({
    loadAudioSource: (audioContext, url) =>
      getAudioBuffer(audioContext, url).then(audioBuffer => dispatch(audioBufferLoaded(audioBuffer)))
  })
)(Audio);
