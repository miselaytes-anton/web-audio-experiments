import React from 'react';
import PropTypes from 'prop-types';
import Head from '../Head';
import {clamp} from '../../util';
class ReadHead extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    minX: PropTypes.number.isRequired,
    maxX: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
  }
  render() {
    const {x, y, handleDragEnd, minX, maxX} = this.props;

    return (
      <Head
        x={x}
        y={y}
        draggable
        onDragMove={e => handleDragEnd(e.target.x() + e.target.offsetX())}
        onDragEnd={e => handleDragEnd(e.target.x() + e.target.offsetX())}
        dragBoundFunc={pos => ({x: clamp([minX, maxX], pos.x), y})}
      />
    );
  }
}

export default ReadHead;
