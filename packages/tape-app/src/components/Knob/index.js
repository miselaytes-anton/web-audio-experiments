import React from 'react';
import {Circle, Text} from 'react-konva';
import PropTypes from 'prop-types';

const degToRad = deg => deg * Math.PI / 180;
const radToDeg = rad => rad * 180 / Math.PI;

const innerR = r => r * 0.6;
const dotR = r => r / 5;

const hip = (a, b) => Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
const mapRange = (fromRange, toRange, number) =>
  (number - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];
const coordToAngle = ([x, y]) => {
  const xAngle = radToDeg(Math.acos(x));
  const yAngle = radToDeg(Math.asin(y));
  if (x > 0 && y < 0) {
    return xAngle;
  }
  if (x < 0 && y < 0) {
    return xAngle;
  }
  if (x < 0 && y > 0) {
    return 180 + yAngle;
  }
  return 360 - yAngle;
};
const angleToCoord = angle => {
  if (angle > 0 && angle <= 90) {
    return [Math.cos(degToRad(angle)), Math.sin(degToRad(angle))];
  }
  if (angle > 90 && angle <= 180) {
    return [Math.cos(degToRad(angle)), Math.sin(degToRad(angle))];
  }
  if (angle > 180 && angle <= 270) {
    return [Math.cos(degToRad(angle)), -Math.sin(degToRad(angle))];
  }
  return [Math.cos(degToRad(angle)), -Math.sin(degToRad(angle))];
};

const rotate = (rotateAngle, angle) => {
  const rotated = angle + rotateAngle;
  if (rotated > 360) {
    return rotated - 360;
  }
  if (rotated < 0) {
    return 360 - rotated;
  }
  return rotated;
};

const normCoord = ([centerX, centerY], [x, y], r) => [x - centerX, y - centerY].map(coord => coord / r);
const denormCoord = ([centerX, centerY], [x, y], r) => [x * r + centerX, y * r + centerY];

const dragBoundFunc = ({r, x, y, leftMarginAngle, leftMarginCoord, rightMarginAngle, rightMarginCoord}) => pos => {
  const a = pos.x - x;
  const b = pos.y - y;
  const k = hip(a, b) / r;
  const newX = x + a / k;
  const newY = y + b / k;
  const newAngle = coordToAngle(normCoord([x, y], [newX, newY], r));
  if (newAngle > leftMarginAngle && newAngle <= 270) {
    return {x: leftMarginCoord[0], y: leftMarginCoord[1]};
  }
  if (newAngle < rightMarginAngle && newAngle > 270) {
    return {x: rightMarginCoord[0], y: rightMarginCoord[1]};
  }
  return {x: newX, y: newY};
};
const MARGIN = 40;
const Knob = ({x, y, fromValue, toValue, handleDragEnd, r, label}) =>
  <React.Fragment>
    <Circle x={x} y={y} radius={r} strokeWidth={2} stroke="black" fill="black" />
    <Circle
      x={x}
      y={y - innerR(r)}
      radius={dotR(r)}
      stroke="white"
      fill="white"
      draggable
      dragBoundFunc={dragBoundFunc({
        x,
        y,
        r: innerR(r),
        leftMarginAngle: 270 - MARGIN,
        leftMarginCoord: denormCoord([x, y], angleToCoord(270 - MARGIN), innerR(r)),
        rightMarginAngle: 270 + MARGIN,
        rightMarginCoord: denormCoord([x, y], angleToCoord(270 + MARGIN), innerR(r)),
      })}
      onDragEnd={e => handleDragEnd(mapRange(
        [MARGIN, 360 - MARGIN],
        [toValue, fromValue],
        rotate(90, coordToAngle(normCoord([x, y], [e.target.x(), e.target.y()], innerR(r))))
      ))}
    />
    <Text x={x - 35} y={y + r + 10} text={label} />
  </React.Fragment>;

Knob.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  fromValue: PropTypes.number.isRequired,
  toValue: PropTypes.number.isRequired,
  handleDragEnd: PropTypes.func.isRequired,
  r: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};
export default Knob;
