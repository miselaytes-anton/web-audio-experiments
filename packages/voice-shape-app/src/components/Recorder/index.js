import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Rec from './Recorder';
import {connect} from 'react-redux';
import {recordFinished} from '../../actions';
import {Button} from '../Styled';

const audioContext = new AudioContext();

//audioContext.resume().then(
class Recorder extends Component {
  static propTypes = {
    publishRecord: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isRecording: false
    };
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(sourceStream => {
        this.recorder = new Rec(audioContext, sourceStream);
      });
  }

  onButtonClick = () => {
    if (!this.state.isRecording) {
      this.recorder.start();
      this.setState({isRecording: true});
    } else {
      this.recorder.stop().then(audioBuffer => {
        this.setState({isRecording: false, audioBuffer});
        this.props.publishRecord(audioBuffer);
      });
    }
  };

  render() {
    const {isRecording} = this.state;
    return <Button onClick={this.onButtonClick} > {isRecording ? 'stop' : 'record'}
    </Button>;
  }
}

export default connect(
  state => state,
  dispatch => ({
    publishRecord: (audioBuffer) => dispatch(recordFinished(audioBuffer))
  })
)(Recorder);
