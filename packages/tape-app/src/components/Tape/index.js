import React from 'react';
import {Line} from 'react-konva';
import TapeCircle from '../TapeCircle';
import PropTypes from 'prop-types';

const RADIUS = 35;

const Tape = ({x1, x2, y1, y2, speed}) =>
  <React.Fragment>
    <TapeCircle x={x1} y={y1} r={RADIUS} speed={speed} />
    <TapeCircle x={x2} y={y2} r={RADIUS} speed={speed} />
    <Line points={[x1, y1 - RADIUS, x2, y2 - RADIUS]} stroke="black" />
  </React.Fragment>;

Tape.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
};
export default Tape;
