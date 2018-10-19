import './style.scss';
const Recorder = require('./Recorder');
const Scheduler = require('./Scheduler');
const {draw} = require('./canvas');
const store = require('./store');
const finishedTracks = tracks => tracks.filter(track => track.end);

let STATE = store.getState();

const init = sourceStream => {
  const audioContext = new AudioContext();
  const recorder = new Recorder(audioContext, sourceStream);
  const scheduler = new Scheduler(audioContext, STATE.loopLength);

  const mediaSourceStream = audioContext.createMediaStreamSource(sourceStream);
  const checkbox = document.getElementById('playthrough');
  checkbox.onchange = () => {
    if (checkbox.checked) {
      mediaSourceStream.connect(audioContext.destination);
    } else {
      mediaSourceStream.disconnect(audioContext.destination);
    }
  };

  document.onkeydown = e => {
    const key = e.which || e.keyCode;
    const keys = {
      d: 68,
      space: 32
    };

    if (e.ctrlKey && key === keys.d) {
      store.dispatch({
        type: 'DELETE_LAST_TRACK'
      });
    } else if (key === keys.space) {
      e.stopPropagation();
      e.preventDefault();
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
    STATE = newState;
  });
};

navigator.mediaDevices.getUserMedia({audio: {
  autoGainControl: false,
  echoCancellation: false,
  noiseSuppression: false,
}})
.then(init);
