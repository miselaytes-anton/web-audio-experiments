const Recorder = require('./Recorder');
const Scheduler = require('./Scheduler');
const {draw} = require('./canvas');
const store = require('./store');

const init = sourceStream => {
  const recordButton = document.querySelector('#record');
  const audioContext = new AudioContext();
  const recorder = new Recorder(audioContext, sourceStream);
  const scheduler = new Scheduler(audioContext, store.getState().loopLength);

  const mediaSourceStream = audioContext.createMediaStreamSource(sourceStream);
  mediaSourceStream.connect(audioContext.destination);
  recordButton.onclick = () => {
    if (!recorder.isRecording()) {
      recorder.start();
      store.dispatch({
        type: 'START_RECORD'
      });
    } else {
      recorder.stop();
      recorder.getRecord().then(record => {
        store.dispatch({
          type: 'FINISH_RECORD',
          record
        });
        scheduler.schedule(record);
      });
    }

    recordButton.innerHTML = recorder.isRecording() ? 'Stop' : 'Record';
  };

  const updateCurrentPosition = () => {
    store.dispatch({
      type: 'UPDATE_CURRENT_POSITION'
    });
    window.requestAnimationFrame(updateCurrentPosition);

  };
  window.requestAnimationFrame(updateCurrentPosition);

  store.subscribe(() => {
    const state = store.getState();
    draw(state);
    if (scheduler.loopLength !== state.loopLength) {
      scheduler.loopLength = state.loopLength;
    }
  });
};

navigator.mediaDevices.getUserMedia({audio: {
  autoGainControl: false,
  echoCancellation: false,
  noiseSuppression: false,
}})
.then(init);
