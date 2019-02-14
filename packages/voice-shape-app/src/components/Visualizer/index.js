import React, {Component} from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {rLinearGradient, hex2rgb, rgb2hex} from 'kandinsky-js';

const W = window.innerWidth;
const H = window.innerHeight * 0.7;
const clamp = (range, v) => {
  if (v < range[0]) {
    return range[0];
  }
  if (v > range[1]) {
    return range[1];
  }
  return v;
};
const mapRange = (fromRange, toRange, number) =>
  (clamp(fromRange, number) - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];

const getCoord = (circleCenter, angleStep, R, values, i) =>
  ([
    circleCenter.x + Math.sin(angleStep * i) * (R + values[i]),
    circleCenter.y + Math.cos(angleStep * i) * (R + values[i])
  ]);
const featureRanges = {
  spectralCentroid: [130, 250],
  mfcc: [-30, 80],
};
const shapeRanges = {
  line: [0, 150],
  colorIndex: [0, 19]
};
const colors = rLinearGradient(
  shapeRanges.colorIndex[1] - shapeRanges.colorIndex[0],
  hex2rgb('#f92104'),
  hex2rgb('#f9f904'),
).map(rgb2hex);

class Visualizer extends Component {
  static propTypes = {
    features: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const canvasContext = this.ref.current.getContext('2d');
    canvasContext.canvas.width = W;
    canvasContext.canvas.height = H;
    const c = {
      x: W / 2,
      y: H / 2 - 50
    };
    const numCoefs = 13;
    const R = 100;
    const drawCycle = () => {
      const {mfcc, spectralCentroid} = this.props.features;
      const angleStep = 2 * Math.PI / numCoefs;
      canvasContext.clearRect(0, 0, W, H);
      canvasContext.beginPath();

      const shape = mfcc.map((v) => mapRange(featureRanges.mfcc, shapeRanges.line, v));

      for (let i = 0; i < numCoefs; i++) {
        const coords = getCoord(c, angleStep, R, shape, i);
        if (i === 0) {
          canvasContext.moveTo(...coords);
        } else {
          canvasContext.lineTo(...coords);
        }
      }
      canvasContext.lineTo(...getCoord(c, angleStep, R, shape, 0));
      const colorIndex = Math.floor(mapRange(featureRanges.spectralCentroid, shapeRanges.colorIndex, spectralCentroid));
      canvasContext.fillStyle = spectralCentroid ? colors[colorIndex] : 'black';
      canvasContext.fill();
      requestAnimationFrame(drawCycle);
    };
    drawCycle();
  }
  render() {
    return <canvas
      ref={this.ref}
      id="main-canvas"
    />;
  }
}

export default connect(
  state => state,
)(Visualizer);
