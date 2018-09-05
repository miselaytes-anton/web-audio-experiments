class Scheduler {
  constructor(audioContext, loopLength) {
    this.audioContext = audioContext;
    this.loopLength = loopLength;
  }
  schedule({buffer, startTime}) {
    const {audioContext, loopLength} = this;
    const _schedule = (buffer, _startTime, isFirstPlay = true) => {
      const startTime = isFirstPlay ? _startTime + loopLength : _startTime;
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.start(startTime);
      sourceNode.onended = () => {
        _schedule(buffer, startTime + loopLength, false);
      };
    };
    _schedule(buffer, startTime);
  }
}

module.exports = Scheduler;
