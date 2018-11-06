import React from 'react';
import {Line} from 'react-konva';
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
    const w = 30;
    const h = 30;
    const headPoly = (x, y, w, h) =>
      [x - w / 2, y - h / 2, x + w / 2, y - h / 2, x + w / 2, y, x + w / 3, y + h / 2, x - w / 3, y + h / 2, x - w / 2, y];
    return (
      <Line
        x={x}
        y={y}
        fill={'black'}
        closed="true"
        points={headPoly(0, 0, w, h)}
        draggable
        onDragMove={e => handleDragEnd(e.target.x() + e.target.offsetX())}
        onDragEnd={e => handleDragEnd(e.target.x() + e.target.offsetX())}
        dragBoundFunc={dragBoundFunc}
      />
    );
  }
}

export default ReadHead;
