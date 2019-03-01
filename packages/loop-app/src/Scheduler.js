const STOP_RECORDING_LATENCY = 0.4;
const START_RECORDING_LATENCY = 0.4;

class Scheduler {
  constructor(audioContext, loopLength) {
    this.audioContext = audioContext;
    this.loopLength = loopLength;
    this.nodes = {};
  }
  schedule({buffer, startTime, id}) {
    const {audioContext, loopLength, nodes} = this;
    const _schedule = (buffer, _startTime, isFirstPlay = true) => {
      const startTime = isFirstPlay ? _startTime + loopLength : _startTime;
      nodes[id] = audioContext.createBufferSource();
      nodes[id].buffer = buffer;
      nodes[id].connect(audioContext.destination);
      nodes[id].start(startTime, START_RECORDING_LATENCY, buffer.duration - STOP_RECORDING_LATENCY);
      nodes[id].onended = () => {
        _schedule(buffer, startTime + loopLength, false);
      };
    };
    _schedule(buffer, startTime);
  }

  unschedule(id) {
    this.nodes[id].onended = () => {};
    this.nodes[id].stop();
  }

  update(tracks) {
    tracks.forEach(track => {
      if (!this.nodes[track.id]) {
        this.schedule(track);
      }
    });
    const trackIds = tracks.map(track => track.id);
    Object.entries(this.nodes).forEach(([id]) => {
      if (!trackIds.includes(id)) {
        this.unschedule(id);
      }
    });
  }
}

export default Scheduler;
