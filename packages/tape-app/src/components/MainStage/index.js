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
    inJointY: H / 8,
    outJointX: W / 4 * 3,
    outJointY: H / 8,
    feedbackInJountX: W / 4,
    feedbackInJountY: H / 8 * 3,
    feedbackOutJountX: W / 4 * 3,
    feedbackOutJountY: H / 8 * 3,

    writeHeadX: W / 4,
    writeHeadY: H / 4 * 3 + 25,
    readHeadX: W / 4 * 3,
    readHeadY: H / 4 * 3 + 25,
    tapeCircle1X: W / 8,
    tapeCircle1Y: H / 8 * 7,
    tapeCircle2X: W / 8 * 7,
    tapeCircle2Y: H / 8 * 7,

    tapeKnobX:  W / 8,
    tapeKnobY: H / 8 * 6 - 10,
    tapeSpeed: 10,

    feedbackKnobX: W / 2,
    feedbackKnobY: H / 8 * 3,
    feedbackAmount: 10
  };
  handleReadHeadDragEnd = x => {
    this.setState({
      readHeadX: x,
    });
  };
  handleTapeSpeedKnobTurn = value => {
    this.setState({
      tapeSpeed: value
    });
  };

  handleFeedbackKnobTurn = value => {
    this.setState({
      feedbackAmount: value
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
      tapeCircle2Y,

      tapeKnobX,
      tapeKnobY,
      tapeSpeed,

      feedbackKnobX,
      feedbackKnobY,
      feedbackAmount,

      feedbackInJountX,
      feedbackInJountY,
      feedbackOutJountX,
      feedbackOutJountY
    } = this.state;
    return (
      <Stage width={W} height={H}>
        <Layer>
          <Circle fill="black" radius={10} x={inJointX} y={inJointY} />
          <Circle fill="black" radius={10} x={outJointX} y={outJointY} />
          <Circle fill="black" radius={10} x={feedbackInJountX} y={feedbackInJountY} />
          <Circle fill="black" radius={10} x={feedbackOutJountX} y={feedbackOutJountY} />
          <Arrow fill="black" stroke="black" points={[inJointX, inJointY, writeHeadX, writeHeadY - 15]} />
          <Arrow fill="black" stroke="black" points={[inJointX, inJointY, outJointX - 10, outJointY]} />

          <Arrow fill="black" stroke="black" points={[feedbackOutJountX, feedbackOutJountY, outJointX, outJointY + 10]} />
          <Arrow fill="black" stroke="black" points={[readHeadX, readHeadY, feedbackOutJountX, feedbackOutJountY + 10]} />

          <Arrow fill="black" stroke="black" points={[feedbackOutJountX, feedbackOutJountY, feedbackInJountX + 10, feedbackInJountY]} />

          <WriteHead x={writeHeadX} y={writeHeadY} />
          <ReadHead x={readHeadX} y={readHeadY} handleDragEnd={this.handleReadHeadDragEnd} />
          <Tape x1={tapeCircle1X} y1={tapeCircle1Y} x2={tapeCircle2X} y2={tapeCircle2Y} speed={tapeSpeed} />
          <Knob
            x={feedbackKnobX}
            y={feedbackKnobY}
            r={25}
            fromValue={0}
            toValue={20}
            value={feedbackAmount}
            handleKnobTurn={this.handleFeedbackKnobTurn}
            label="FEEDBACK"
          />
          <Knob
            x={tapeKnobX}
            y={tapeKnobY}
            r={25}
            fromValue={0}
            toValue={20}
            value={tapeSpeed}
            handleKnobTurn={this.handleTapeSpeedKnobTurn}
            label="TAPE SPEED"
          />
        </Layer>
      </Stage>
    );
  }
}

export default MainStage;
