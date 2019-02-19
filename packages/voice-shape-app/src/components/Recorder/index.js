import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Rec from './Recorder';
import {connect} from 'react-redux';
import {recordFinished} from '../../actions';
import {Button} from '../Styled';

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
    return <Button onClick={this.onButtonClick} > {isRecording ? 'stop' : 'record'}
    </Button>;
  }
}

export default connect(
  state => ({audioContext: state.audioContext}),
  dispatch => ({
    publishRecord: (audioBuffer) => dispatch(recordFinished(audioBuffer))
  })
)(Recorder);
