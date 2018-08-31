class Scheduler {
  constructor(audioContext, tapeLength) {
    this.audioContext = audioContext;
    this.tapeLength = tapeLength;
  }
  schedule({buffer, startTime}) {
    const {audioContext, tapeLength} = this;
    const _schedule = (buffer, _startTime, isFirstPlay = true) => {
      const startTime = isFirstPlay ? _startTime + tapeLength : _startTime;
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.connect(audioContext.destination);
      sourceNode.start(startTime);
      sourceNode.onended = () => {
        _schedule(buffer, startTime + tapeLength, false);
      };
    };
    _schedule(buffer, startTime);
  }
}

module.exports = Scheduler;
