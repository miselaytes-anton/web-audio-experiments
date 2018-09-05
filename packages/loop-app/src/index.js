const {mapRange} = require('./util');
const Recorder = require('./Recorder');
const Scheduler = require('./Scheduler');
const {draw} = require('./canvas');
const store = require('./store');

const updateCurrentPosition = () => {
  store.dispatch({
    type: 'UPDATE_CURRENT_POSITION'
  });
  window.requestAnimationFrame(updateCurrentPosition);

}
window.requestAnimationFrame(updateCurrentPosition);

store.subscribe(() => draw(store.getState()));

const audioContext = new AudioContext();
const recorder = new Recorder(audioContext);
const scheduler = new Scheduler(audioContext, store.getState().loopLength);

const recordButton = document.querySelector('#record');

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
