const CompositeAudioNode = require('./composite-audio-node');

module.exports = class LowPassCombFilter extends CompositeAudioNode {

  get resonance () {
    return this._gain.gain;
  }

  get dampening () {
    return this._lowPass.frequency;
  }

  get delayTime () {
    return this._delay.delayTime;
  }

  constructor (audioCtx, options) {
    super(audioCtx, options);
    const {delayTime, resonance: gainValue, dampening: frequency} = options;
    this._lowPass = new BiquadFilterNode(audioCtx, {type: 'lowpass', frequency});
    this._delay = new DelayNode(audioCtx, {delayTime});
    this._gain = audioCtx.createGain();
    this._gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);

    this._input
    .connect(this._delay)
    .connect(this._lowPass)
    .connect(this._gain)
    .connect(this._input)
    .connect(this._output);

  }
};

