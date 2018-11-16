import React from 'react';
import PropTypes from 'prop-types';
import {Arrow, Text} from 'react-konva';
import Head from '../Head';
import {clamp} from '../../util';
class ReadHead extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    minX: PropTypes.number.isRequired,
    maxX: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
  }
  render() {
    const {x, y, handleDragEnd, minX, maxX, label} = this.props;

    return (
      <React.Fragment>
        <Head
          x={x}
          y={y}
          draggable
          onDragMove={e => handleDragEnd(e.target.x() + e.target.offsetX())}
          onDragEnd={e => handleDragEnd(e.target.x() + e.target.offsetX())}
          dragBoundFunc={pos => ({x: clamp([minX, maxX], pos.x), y})}
        />
        <Arrow
          pointerAtBeginning="true"
          fill="black"
          strokeWidth={1}
          stroke="black"
          points={[x - 30, y + 30, x + 30, y + 30]}
          pointerWidth={5}
        />
        <Text x={x - 25} y={y + 50} text={label} />
      </React.Fragment>
    );
  }
}

export default ReadHead;
