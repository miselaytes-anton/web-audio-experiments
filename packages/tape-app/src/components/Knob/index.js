import React from 'react';
import {Circle} from 'react-konva';
import PropTypes from 'prop-types';

const RADIUS = 30;

const Knob = ({x, y}) =>
  <React.Fragment>
    <Circle x={x} y={y} radius={RADIUS} strokeWidth={2} stroke="black" />
    <Circle x={x} y={y - 20} radius={5} fill="black" />
  </React.Fragment>;

Knob.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};
export default Knob;
