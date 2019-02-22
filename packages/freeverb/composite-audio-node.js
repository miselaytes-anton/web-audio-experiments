//based on https://github.com/GoogleChromeLabs/web-audio-samples/wiki/CompositeAudioNode
//with little adjustments to allow chained connect syntax, e.g node1.connect(node2).connect(node3)

export default class CompositeAudioNode {

  get _isCompositeAudioNode () {
    return true;
  }

  constructor (audioCtx) {
    this.audioCtx = audioCtx;
    this._input = this.audioCtx.createGain();
    this._output = this.audioCtx.createGain();
  }

  connect () {
    this._output.connect.apply(this._output, arguments);
  }

  disconnect () {
    this._output.disconnect.apply(this._output, arguments);
  }
}
if (typeof window === 'object' && !AudioNode.prototype.connectIsModified) {
  AudioNode.prototype._connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function () {
    const args = Array.prototype.slice.call(arguments);
    if (args[0]._isCompositeAudioNode) {
      this._connect.apply(this, [args[0]._input].concat(args.slice(1)));
    } else {
      this._connect.apply(this, args);
    }

    return args[0];
  };
  AudioNode.prototype.connectIsModified = true;
}

