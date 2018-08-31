//https://codepen.io/jamesseanwright/pen/jrmayRv
const Recorder = require('./Recorder');
const Scheduler = require('./Scheduler');

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

