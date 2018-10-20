import React from 'react';
import {Rect} from 'react-konva';
import PropTypes from 'prop-types';

class ReadHead extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
  }
  render() {
    const {x, y, handleDragEnd} = this.props;
    const dragBoundFunc = pos => ({x: pos.x, y});
    return (
      <Rect
        x={x - 15}
        y={y}
        width={30}
        height={30}
        fill={'black'}
        draggable
        onDragMove={handleDragEnd}
        onDragEnd={handleDragEnd}
        dragBoundFunc={dragBoundFunc}
      />
    );
  }
}

export default ReadHead;
