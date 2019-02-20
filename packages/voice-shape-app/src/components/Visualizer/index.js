import React, {Component} from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {multiGradient, rgb2hsl, hsl2css} from 'kandinsky-js';
import {playAudio} from '../../audio';
import playIcon from '../../../assets/play.png';

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
const getRatio = (canvasContext) => {
    const dpr = window.devicePixelRatio || 1;
    const bsr = canvasContext.webkitBackingStorePixelRatio ||
      canvasContext.mozBackingStorePixelRatio ||
      canvasContext.msBackingStorePixelRatio ||
      canvasContext.oBackingStorePixelRatio ||
      canvasContext.backingStorePixelRatio || 1;

  return dpr / bsr;
};
const setCanvasSize = (canvasContext, W, H) => {
  const ratio = getRatio(canvasContext);
  canvasContext.canvas.width = W;
  canvasContext.canvas.height = H;
  canvasContext.canvas.width = W * ratio;
  canvasContext.canvas.height = H * ratio;
  canvasContext.canvas.style.width = W + 'px';
  canvasContext.canvas.style.height = H + 'px';
  canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);
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
  mfcc: [-10, 10],
};
const shapeRanges = {
  line: [0, 100],
  colorIndex: [0, 19]
};

const alpha = 1;
const colors = multiGradient(
  shapeRanges.colorIndex[1] - shapeRanges.colorIndex[0],
  [[1, 0, 128], [241, 73, 0], [0, 128, 1], [247, 235, 1], [240, 0, 1]].map(rgb2hsl),
).map(hsl => hsl2css(alpha, hsl));
const introText = ['Say "Hello, Hello, Hello"!', 'Shape is based on your voice timbre and color on pitch.'];
const font = '40px "Exo 2"';

class Visualizer extends Component {
  static propTypes = {
    features: PropTypes.object.isRequired,
    onShapeClick: PropTypes.func,
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
    setCanvasSize(canvasContext, W, H);
    const c = {
      x: W / 2,
      y: H / 2 - 50
    };
    const numCoefs = 13;
    const R = 100;
    const drawCycle = () => {
      const {mfcc, spectralCentroid} = this.props.features;
      canvasContext.canvas.style.cursor = spectralCentroid ? `url(${playIcon}), auto` : 'auto';
      if (!spectralCentroid) {
        canvasContext.font = font;
        canvasContext.fillStyle = 'white';
        canvasContext.textAlign = 'center';
        canvasContext.fillText(introText[0], c.x, c.y);
        canvasContext.fillText(introText[1], c.x, c.y + 80);
        return requestAnimationFrame(drawCycle);
      }
      const angleStep = 2 * Math.PI / numCoefs;
      canvasContext.clearRect(0, 0, W, H);
      const colorIndex = Math.floor(mapRange(featureRanges.spectralCentroid, shapeRanges.colorIndex, spectralCentroid));
      canvasContext.fillStyle = spectralCentroid ? colors[colorIndex] : 'black';
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
      canvasContext.fill();

      return requestAnimationFrame(drawCycle);
    };
    drawCycle();
  }
  render() {
    return <canvas
      ref={this.ref}
      id="main-canvas"
      style={{backgroundColor: 'black', font, width: '100%', height: '100%'}}
      onClick={() => {
        this.props.onShapeClick();
      }
      }
    />;
  }
}

export default connect(
  state => ({
    onShapeClick: () => playAudio(state.audioContext, state.audioBuffer),
    features: state.features,
  }),
)(Visualizer);
