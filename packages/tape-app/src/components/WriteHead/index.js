import React from 'react';
import {Rect} from 'react-konva';
import PropTypes from 'prop-types';

class WriteHead extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,

  }
  render() {
    const {x, y} = this.props;
    return (
      <Rect
        x={x - 15}
        y={y}
        width={30}
        height={30}
        fill={'black'}
      />
    );
  }
}

export default WriteHead;
