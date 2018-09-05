const {mapRange} = require('./util');
const Recorder = require('./Recorder');
const Scheduler = require('./Scheduler');
const {draw} = require('./canvas');

const state = {
  trackLength: 20,
  tracks: [
    {start: 1.5, duration: 10.3},
    {start: 11, duration: 3.5},
    {start: 10, duration: 10},
  ],
  currentPosition: 0
};
const update = state => {
  draw(state);
  const positionChange = mapRange([0, state.trackLength], [0, 0.6], 1)
  const newState = {...state, ...{currentPosition: state.currentPosition + positionChange}};
  window.requestAnimationFrame(() => update(newState));
};
window.requestAnimationFrame(() => update(state));

//in seconds
const TAPE_LENGTH = 5;

const audioContext = new AudioContext();
const recorder = new Recorder(audioContext);
const scheduler = new Scheduler(audioContext, TAPE_LENGTH);

const recordButton = document.querySelector('#record');

recordButton.onclick = () => {
  if (!recorder.isRecording()) {
    recorder.start();
  } else {
    recorder.stop();
    recorder.getRecord().then(record => scheduler.schedule(record));
  }

  recordButton.innerHTML = recorder.isRecording() ? 'Stop' : 'Record';
};

