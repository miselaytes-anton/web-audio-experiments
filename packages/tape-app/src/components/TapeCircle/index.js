import React from 'react';
import {Circle, Line} from 'react-konva';
import PropTypes from 'prop-types';

import {denormCoord, angleToCoord} from '../../util';

class TapeCirlce extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rotation: 0};
  }

  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired,
    speed: PropTypes.number.isRequired,
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.rotate(),
      50
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  rotate() {
    this.setState(prevState => ({
      rotation: prevState.rotation - this.props.speed
    }));
  }

  render() {
    const {x, y, r} = this.props;
    const {rotation} = this.state;
    const getLinePoints = angle => [x, y, ...denormCoord([x, y], angleToCoord(angle), r)];
    return (
      <React.Fragment>
        <Circle x={x} y={y} radius={r} strokeWidth={2} stroke="black" />
        <Circle x={x} y={y} radius={5} fill="black" />
        <Line points={getLinePoints(30 + rotation)} stroke="black" />
        <Line points={getLinePoints(150 + rotation)} stroke="black" />
        <Line points={getLinePoints(270 + rotation)} stroke="black" />
      </React.Fragment>
    );
  }
}

export default TapeCirlce;
