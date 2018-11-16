import React, {Component} from 'react';
import Head from '../Head';
import Tape from '../Tape';
import {FeedbackKnob, MixKnob, LowpassKnob} from '../Knobs';
import Reader1 from '../Reader';

import {Arrow, Circle, Text} from 'react-konva';
import {Stage, Layer} from 'react-konva';

const W = window.innerWidth;
const H = window.innerHeight - 50;

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
    writeHeadY: H / 4 * 3 + 15,
    readHeadX: W / 4 * 3,
    readHeadY: H / 4 * 3 + 15,
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

  render() {
    const {
      inJointX,
      inJointY,
      outJointX,
      outJointY,
      readHeadY,
      writeHeadX,
      writeHeadY,
      tapeCircle1X,
      tapeCircle1Y,
      tapeCircle2X,
      tapeCircle2Y,
      feedbackKnobX,
      feedbackKnobY,
      feedbackInJountX,
      feedbackInJountY,
      feedbackOutJountX,
      feedbackOutJountY
    } = this.state;
    return (
      <Stage width={W} height={H}>
        <Layer>
          <Text x={tapeCircle1X} y={inJointY - 20} text="AUDIO IN" />
          <Arrow fill="black" stroke="black" points={[tapeCircle1X, inJointY, inJointX - 10, inJointY]} pointerWidth={7} />

          <Text x={tapeCircle2X - 65} y={outJointY - 20} text="AUDIO OUT" />
          <Arrow fill="black" stroke="black" points={[outJointX, outJointY, tapeCircle2X, outJointY]} pointerWidth={7} />

          <Circle fill="black" radius={5} x={inJointX} y={inJointY} />
          <MixKnob x={outJointX} y={outJointY} toplabel="MIX" />
          <Circle fill="black" radius={5} x={feedbackInJountX} y={feedbackInJountY} />

          <Arrow fill="black" stroke="black" points={[inJointX, inJointY, outJointX - 25, outJointY]} pointerWidth={7} />
          <Arrow fill="black" stroke="black" points={[feedbackOutJountX, feedbackOutJountY, outJointX, outJointY + 25]} pointerWidth={7} />
          <Arrow fill="black" stroke="black" points={[feedbackOutJountX, feedbackOutJountY, feedbackInJountX + 10, feedbackInJountY]} pointerWidth={7} />

          <Arrow fill="black" stroke="black" points={[inJointX, inJointY, writeHeadX, writeHeadY - 15]} pointerWidth={7} />
          <Head x={writeHeadX} y={writeHeadY} />

          <Reader1
            wireEndX={feedbackOutJountX}
            wireEndY={feedbackOutJountY + 30}
            readerHeadY={readHeadY}
            readerHeadMinX={W / 2}
            readerHeadMaxX={feedbackOutJountX}
            fromValue={0}
            toValue={20}
          />
          <Tape x1={tapeCircle1X} y1={tapeCircle1Y} x2={tapeCircle2X} y2={tapeCircle2Y} />
          <FeedbackKnob x={feedbackKnobX} y={feedbackKnobY} bottomlabel="FEEDBACK" />
          <LowpassKnob x={feedbackOutJountX} y={feedbackOutJountY} bottomlabel="LOWPASS" />
        </Layer>
      </Stage>
    );
  }
}

export default MainStage;
