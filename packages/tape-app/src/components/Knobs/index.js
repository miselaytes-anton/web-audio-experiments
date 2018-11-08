import Knob from '../Knob';
import {connect} from 'react-redux';
import {changeParamValue} from '../../actions';

export const FeedbackKnob = connect(
  state => ({value: state.feedbackAmount}),
  dispatch => ({
    handleKnobTurn: value => dispatch(changeParamValue('FEEDBACK', value))
  })
)(Knob);

export const MixKnob = connect(
  state => ({value: state.mix}),
  dispatch => ({
    handleKnobTurn: value => dispatch(changeParamValue('MIX', value))
  })
)(Knob);

export const LowpassKnob = connect(
  state => ({value: state.lowpass}),
  dispatch => ({
    handleKnobTurn: value => dispatch(changeParamValue('LOWPASS', value))
  })
)(Knob);
