const {createStore} = require('redux');
const genId = () => Math.random().toString(36).substr(2, 9);

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_POSITION':
      const positionChange = 1 / 60;
      return Object.assign({}, state, {currentPosition: (state.currentPosition + positionChange) % state.loopLength});
    case 'START_RECORD':
      const startedTrack = {id: genId(), start: state.currentPosition, startTime: action.startTime};
      return Object.assign({}, state, {tracks: [...state.tracks, startedTrack]}, {isRecording: true});
    case 'FINISH_RECORD':
      const {start, id, startTime} = state.tracks[state.tracks.length - 1];
      const finishedTrack = {
        id,
        start,
        startTime,
        end: start + action.buffer.duration,
        buffer: action.buffer
      };
      // if its the first recorded track - lets reset the global loop length to it
      const loopLength = state.tracks.length === 1 ? finishedTrack.end - finishedTrack.start : state.loopLength;
      return Object.assign({}, state, {tracks: [...state.tracks.slice(0, -1), finishedTrack]}, {loopLength, isRecording: false});
    case 'DELETE_LAST_TRACK':
      return Object.assign({}, state, {tracks: state.tracks.slice(0, -1)});
    default:
      return state;
  }
};

const initialState = {
  // in seconds
  // lets make it very high so we have enough time for the first track
  loopLength: 30,
  tracks: [],
  currentPosition: 0,
  isRecording: false
};

const store = createStore(reducer, initialState);

module.exports = store;
