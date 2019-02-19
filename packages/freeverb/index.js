const CompositeAudioNode = require('./composite-audio-node');
const mergeParams = require('./merge-params');
const LowpassCombFilter = require('./low-pass-comb-filter');

// Freeverb params defined by Mr. Shroeder
const SAMPLE_RATE = 44100;
const COMB_FILTER_TUNINGS = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116];
const ALLPASS_FREQUENCES = [225, 556, 441, 341];

const getAllPass = (audioCtx, freq) => {
  const allPass = audioCtx.createBiquadFilter();
  allPass.type = 'allpass';
  allPass.frequency.value = freq;
  return allPass;
};

module.exports = class Freeverb extends CompositeAudioNode {

  get wetGain () {
    return this._wet.gain;
  }

  get dryGain () {
    return this._dry.gain;
  }

  get roomSize() {
    return mergeParams(this._combFilters.map(comb => comb.resonance));
  }

  get dampening() {
    return mergeParams(this._combFilters.map(comb => comb.dampening));
  }

  constructor (audioCtx, options) {
    super(audioCtx, options);
    const {roomSize: resonance, dampening, wetGain, dryGain} = options;

    this._wet = audioCtx.createGain();
    this._wet.gain.setValueAtTime(wetGain, audioCtx.currentTime);
    this._dry = audioCtx.createGain();
    this._dry.gain.setValueAtTime(dryGain, audioCtx.currentTime);
    this._combFilters = COMB_FILTER_TUNINGS
    .map(delayPerSecond => delayPerSecond / SAMPLE_RATE)
    .map(delayTime => new LowpassCombFilter(audioCtx, {dampening, resonance, delayTime}));

    const merger = audioCtx.createChannelMerger(2);
    const splitter = audioCtx.createChannelSplitter(2);
    const combLeft = this._combFilters.slice(0, 4);
    const combRight = this._combFilters.slice(4);
    const allPassFilters = ALLPASS_FREQUENCES.map(freq => getAllPass(audioCtx, freq));

    //connect all nodes
    this._input.connect(this._wet).connect(splitter);
    this._input.connect(this._dry).connect(this._output);
    combLeft.forEach(comb => {
      splitter.connect(comb, 0).connect(merger, 0, 0);
    });
    combRight.forEach(comb => {
      splitter.connect(comb, 1).connect(merger, 0, 1);
    });
    merger
    .connect(allPassFilters[0])
    .connect(allPassFilters[1])
    .connect(allPassFilters[2])
    .connect(allPassFilters[3])
    .connect(this._output);

  }
};
