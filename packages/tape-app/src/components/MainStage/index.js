import React, {Component} from 'react';
import ReadHead from '../ReadHead';
import WriteHead from '../WriteHead';
import Tape from '../Tape';
import Knob from '../Knob';
import {Arrow, Circle} from 'react-konva';
import {Stage, Layer} from 'react-konva';

const W = window.innerWidth;
const H = window.innerHeight;

class MainStage extends Component {
  state = {
    inJointX: W / 4,
    inJointY: H / 4,
    outJointX: W / 4 * 3,
    outJointY: H / 4,
    writeHeadX: W / 4,
    writeHeadY: H / 4 * 3,
    readHeadX: W / 4 * 3,
    readHeadY: H / 4 * 3,
    tapeCircle1X: W / 8,
    tapeCircle1Y: H / 8 * 7,
    tapeCircle2X: W / 8 * 7,
    tapeCircle2Y: H / 8 * 7,
  };
  handleReadHeadDragEnd = e => {
    this.setState({
      readHeadX: e.target.x(),
    });
  };
  render() {
    const {
      inJointX,
      inJointY,
      outJointX,
      outJointY,
      readHeadX,
      readHeadY,
      writeHeadX,
      writeHeadY,
      tapeCircle1X,
      tapeCircle1Y,
      tapeCircle2X,
      tapeCircle2Y
    } = this.state;
    return (
      <Stage width={W} height={H}>
        <Layer>
          <Knob x={W / 2} y={H / 2} />
          <Circle fill="black" radius={10} x={inJointX} y={inJointY} />
          <Circle fill="black" radius={10} x={outJointX} y={outJointY} />
          <Arrow fill="black" stroke="black" points={[inJointX, inJointY, outJointX - 10, outJointY]} />
          <Arrow fill="black" stroke="black" points={[inJointX, inJointY, writeHeadX, writeHeadY]} />
          <Arrow fill="black" stroke="black" points={[readHeadX, readHeadY, outJointX, outJointY + 10]} />
          <WriteHead x={writeHeadX} y={writeHeadY} />
          <ReadHead x={readHeadX} y={readHeadY} handleDragEnd={this.handleReadHeadDragEnd} />
          <Tape x1={tapeCircle1X} y1={tapeCircle1Y} x2={tapeCircle2X} y2={tapeCircle2Y} />
        </Layer>
      </Stage>
    );
  }
}

export default MainStage;
