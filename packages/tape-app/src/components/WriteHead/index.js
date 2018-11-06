import React from 'react';
import {Line} from 'react-konva';
import PropTypes from 'prop-types';

class WriteHead extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }
  render() {
    const {x, y} = this.props;
    const w = 30;
    const h = 30;
    const headPoly = (x, y, w, h) =>
      [x - w / 2, y - h / 2, x + w / 2, y - h / 2, x + w / 2, y, x + w / 3, y + h / 2, x - w / 3, y + h / 2, x - w / 2, y];
    return (
      <Line
        fill={'black'}
        closed="true"
        points={headPoly(x, y, w, h)}
      />
    );
  }
}

export default WriteHead;
