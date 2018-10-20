import React from 'react';
import {Circle, Line} from 'react-konva';
import PropTypes from 'prop-types';

const degToRad = deg => deg * Math.PI / 180;
const TapeCirlce = ({x, y, r}) =>
  <React.Fragment>
    <Circle x={x} y={y} radius={r} strokeWidth={2} stroke="black" />
    <Circle x={x} y={y} radius={5} fill="black" />
    <Line points={[x, y, x, y - r]} stroke="black" />
    <Line points={[x, y, x + Math.cos(degToRad(30)) * r, y + Math.sin(degToRad(30)) * r]} stroke="black" />
    <Line points={[x, y, x + Math.cos(degToRad(150)) * r, y + Math.sin(degToRad(150)) * r]} stroke="black" />
  </React.Fragment>;

TapeCirlce.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired
};
export default TapeCirlce;
