import React from 'react';
import {Circle, Text} from 'react-konva';
import PropTypes from 'prop-types';
import {hip, coordToAngle, angleToCoord, normCoord, denormCoord, mapRange, rotate} from '../../util';

const dragBoundFunc = ({r, x, y, leftMarginAngle, rightMarginAngle}) => pos => {
  const a = pos.x - x;
  const b = pos.y - y;
  const k = hip(a, b) / r;
  const newX = x + a / k;
  const newY = y + b / k;
  const newAngle = coordToAngle(normCoord([x, y], [newX, newY], r));
  if (newAngle > leftMarginAngle && newAngle <= 270) {
    let leftMarginCoord = denormCoord([x, y], angleToCoord(leftMarginAngle), r);
    return {x: leftMarginCoord[0], y: leftMarginCoord[1]};
  }
  if (newAngle < rightMarginAngle && newAngle > 270) {
    let rightMarginCoord = denormCoord([x, y], angleToCoord(rightMarginAngle), r);
    return {x: rightMarginCoord[0], y: rightMarginCoord[1]};
  }
  return {x: newX, y: newY};
};
const MARGIN = 40;

const Knob = ({x, y, fromValue, toValue, handleKnobTurn, r: R, label, value}) => {
  const r = R * 0.6;
  const dotR = r / 5;
  const dotAngle = mapRange(
    [toValue, fromValue],
    [MARGIN, 360 - MARGIN],
    value);
  const rotated = rotate(-90, dotAngle);
  const [xInner, yInner] = denormCoord([x, y], angleToCoord(rotated), r);

  const handleDragEnd = e => handleKnobTurn(mapRange(
    [MARGIN, 360 - MARGIN],
    [toValue, fromValue],
    rotate(90, coordToAngle(normCoord([x, y], [e.target.x(), e.target.y()], r)))
  ));

  return <React.Fragment>
    <Circle x={x} y={y} radius={R} strokeWidth={2} stroke="black" fill="black" />
    <Circle
      x={xInner}
      y={yInner}
      radius={dotR}
      stroke="white"
      fill="white"
      draggable
      dragBoundFunc={dragBoundFunc({
        x,
        y,
        r,
        leftMarginAngle: 270 - MARGIN,
        rightMarginAngle: 270 + MARGIN,
      })}
      onDragEnd={handleDragEnd}
    />
    <Text x={x - label.length * 3.5} y={y + R + 10} text={label} />
  </React.Fragment>;
};
Knob.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  fromValue: PropTypes.number.isRequired,
  toValue: PropTypes.number.isRequired,
  handleKnobTurn: PropTypes.func.isRequired,
  r: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};
export default Knob;
