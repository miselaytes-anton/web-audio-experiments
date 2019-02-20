import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Rec from './Recorder';
import {connect} from 'react-redux';
import {recordFinished} from '../../actions';
import {FaMicrophone} from 'react-icons/fa';

class Recorder extends Component {
  static propTypes = {
    publishRecord: PropTypes.func.isRequired,
    audioContext: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      audioIsResumed: false
    };
  }
  componentDidMount() {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(sourceStream => {
        this.recorder = new Rec(this.props.audioContext, sourceStream);
      });
  }

  onButtonClick = () => {
    const P = this.state.audioIsResumed
      ? Promise.resolve()
      : this.props.audioContext.resume()
        .then(() => {
          this.setState({audioIsResumed: true});
        });
    P.then(() => {
      if (!this.state.isRecording) {
        this.recorder.start();
        this.setState({isRecording: true});
      } else {
        this.recorder.stop().then(audioBuffer => {
          this.setState({isRecording: false, audioBuffer});
          this.props.publishRecord(audioBuffer);
        });
      }
    });
  };

  render() {
    const {isRecording} = this.state;
    const color = isRecording ? 'red' : 'black';
    return <FaMicrophone style={{fontSize: '3rem', cursor: 'pointer', color}} onClick={this.onButtonClick} />;
  }
}

export default connect(
  state => ({audioContext: state.audioContext}),
  dispatch => ({
    publishRecord: (audioBuffer) => dispatch(recordFinished(audioBuffer))
  })
)(Recorder);
