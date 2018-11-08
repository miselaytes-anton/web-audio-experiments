import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getAudioBuffer} from 'web-audio-utils';
import {audioBufferLoaded} from '../../actions';
import PropTypes from 'prop-types';
import poem from '../../audio/poem.mp3';

import createVirtualAudioGraph, {
  delay,
  gain,
  bufferSource
} from 'virtual-audio-graph';

const paramsToGraph = ({tapeSpeed, feedbackAmount, reader1Position, audioBuffer}) => {
  return {
    master: gain('output', {gain: 0.7}),
    dry: gain('master', {gain: 0.3}),
    wet: gain('master', {gain: 0.7}),
    feedback: gain(['delay'], {gain: 0.3}),
    delay: delay(['feedback', 'wet'], {delayTime: 0.7}),
    bufferSource: bufferSource(['delay', 'dry'], {buffer: audioBuffer, loop: true})
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
