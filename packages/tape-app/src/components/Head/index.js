import React from 'react';
import {Line} from 'react-konva';
import PropTypes from 'prop-types';

const headPoly = (x, y, w, h) =>
  [x - w / 2, y - h / 2, x + w / 2, y - h / 2, x + w / 2, y, x + w / 3, y + h / 2, x - w / 3, y + h / 2, x - w / 2, y];

class Head extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }
  render() {
    const {x, y, ...props} = this.props;
    const w = 30;
    const h = 30;

    return (
      <Line
        x={x}
        y={y}
        fill={'black'}
        closed="true"
        points={headPoly(0, 0, w, h)}
        {...props}
      />
    );
  }
}

export default Head;
