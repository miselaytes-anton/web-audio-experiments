import './style.scss';
const Recorder = require('./Recorder');
const Scheduler = require('./Scheduler');
const {draw} = require('./canvas');
const store = require('./store');
const finishedTracks = tracks => tracks.filter(track => track.end);

let STATE = store.getState();

const init = sourceStream => {
  const recordButton = document.querySelector('#record');
  const audioContext = new AudioContext();
  const recorder = new Recorder(audioContext, sourceStream);
  const scheduler = new Scheduler(audioContext, STATE.loopLength);

  const mediaSourceStream = audioContext.createMediaStreamSource(sourceStream);
  mediaSourceStream.connect(audioContext.destination);
  recordButton.onclick = () => {
    if (!STATE.isRecording) {
      recorder.start().then(startTime => {
        store.dispatch({
          type: 'START_RECORD',
          startTime
        });
      });
    } else {
      recorder.stop().then(buffer => {
        store.dispatch({
          type: 'FINISH_RECORD',
          buffer
        });
      });
    }
  };

  document.onkeyup = e => {
    const key = e.which || e.keyCode;
    const d = 68;
    if (e.ctrlKey && key === d) {
      store.dispatch({
        type: 'DELETE_LAST_TRACK'
      });
    }
  };

  const updateCurrentPosition = () => {
    store.dispatch({
      type: 'UPDATE_CURRENT_POSITION'
    });
    window.requestAnimationFrame(updateCurrentPosition);

  };
  window.requestAnimationFrame(updateCurrentPosition);

  store.subscribe(() => {
    const newState = store.getState();
    draw(newState);
    if (scheduler.loopLength !== newState.loopLength) {
      scheduler.loopLength = newState.loopLength;
    }
    if (finishedTracks(newState.tracks).length !== finishedTracks(STATE.tracks).length) {
      scheduler.update(finishedTracks(newState.tracks));
    }
    if (STATE.isRecording !== newState.isRecording) {
      recordButton.innerHTML = newState.isRecording ? 'Stop' : 'Record';
    }
    STATE = newState;
  });
};

navigator.mediaDevices.getUserMedia({audio: {
  autoGainControl: false,
  echoCancellation: false,
  noiseSuppression: false,
}})
.then(init);
