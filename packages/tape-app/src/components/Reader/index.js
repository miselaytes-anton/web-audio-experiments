import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {changeReaderPosition} from '../../actions';
import ReadHead from '../ReadHead';
import {Arrow} from 'react-konva';
import {mapRange} from '../../util';

class Reader extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    readerHeadMinX: PropTypes.number.isRequired,
    readerHeadMaxX: PropTypes.number.isRequired,
    fromValue: PropTypes.number.isRequired,
    toValue: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onPositionChange: PropTypes.func.isRequired,
    readerHeadY: PropTypes.number.isRequired,
    wireEndX: PropTypes.number.isRequired,
    wireEndY: PropTypes.number.isRequired,
  };
  render() {
    const {wireEndX, wireEndY, readerHeadY, readerHeadMinX, readerHeadMaxX, fromValue, toValue, value, onPositionChange} = this.props;
    const readerHeadX = mapRange([fromValue, toValue], [readerHeadMinX, readerHeadMaxX], value);
    return <React.Fragment>
      <Arrow fill="black" stroke="black" points={[readerHeadX, readerHeadY, wireEndX, wireEndY]} />
      <ReadHead
        x={readerHeadX}
        y={readerHeadY}
        handleDragEnd={x => onPositionChange(mapRange([readerHeadMinX, readerHeadMaxX], [fromValue, toValue], x))}
      />

    </React.Fragment>;
  }
}

const Reader1 = connect(
  state => ({value: state.reader1Position}),
  dispatch => ({
    onPositionChange: position => dispatch(changeReaderPosition(position, 1))
  })
)(Reader);

export default Reader1;
