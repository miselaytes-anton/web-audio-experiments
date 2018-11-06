import React from 'react';
import PropTypes from 'prop-types';
import Knob from '../Knob';
import {connect} from 'react-redux';
import {changeFeedback} from '../../actions';

const FeedbackKnob = ({x, y, feedbackAmount, onAmountChange}) =>
  <Knob
    x={x}
    y={y}
    r={25}
    fromValue={0}
    toValue={20}
    value={feedbackAmount}
    handleKnobTurn={onAmountChange}
    label="FEEDBACK"
  />;

FeedbackKnob.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  feedbackAmount: PropTypes.number.isRequired,
};

export default connect(
  state => ({feedbackAmount: state.feedbackAmount}),
  dispatch => ({
    onAmountChange: value => dispatch(changeFeedback(value))
  })
)(FeedbackKnob);
