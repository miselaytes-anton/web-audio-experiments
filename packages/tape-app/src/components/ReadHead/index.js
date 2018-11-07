import React from 'react';
import PropTypes from 'prop-types';
import Head from '../Head';

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
      <Head
        x={x}
        y={y}
        draggable
        onDragMove={e => handleDragEnd(e.target.x() + e.target.offsetX())}
        onDragEnd={e => handleDragEnd(e.target.x() + e.target.offsetX())}
        dragBoundFunc={dragBoundFunc}
      />
    );
  }
}

export default ReadHead;
