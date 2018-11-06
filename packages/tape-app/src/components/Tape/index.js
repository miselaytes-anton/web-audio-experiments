import React from 'react';
import {Line} from 'react-konva';
import TapeCircle from '../TapeCircle';
import PropTypes from 'prop-types';
import Knob from '../Knob';
import {connect} from 'react-redux';
import {changeSpeed} from '../../actions';

const RADIUS = 35;

const Tape = ({x1, x2, y1, y2, tapeSpeed, onSpeedChange}) =>
  <React.Fragment>
    <TapeCircle x={x1} y={y1} r={RADIUS} speed={tapeSpeed} />
    <TapeCircle x={x2} y={y2} r={RADIUS} speed={tapeSpeed} />
    <Line points={[x1, y1 - RADIUS, x2, y2 - RADIUS]} stroke="black" />
    <Knob
      x={x1}
      y={y1 - 100}
      r={25}
      fromValue={0}
      toValue={20}
      value={tapeSpeed}
      handleKnobTurn={onSpeedChange}
      label="TAPE SPEED"
    />
  </React.Fragment>;

Tape.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  onSpeedChange: PropTypes.func.isRequired,
  tapeSpeed: PropTypes.number.isRequired,
};

export default connect(
  state => ({tapeSpeed: state.tapeSpeed}),
  dispatch => ({
    onSpeedChange: value => dispatch(changeSpeed(value))
  })
)(Tape);
