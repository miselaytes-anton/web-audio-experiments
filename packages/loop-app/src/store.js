const {createStore} = require('redux');

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_POSITION':
      const positionChange = 1 / 60;
      return Object.assign({}, state, {currentPosition: (state.currentPosition + positionChange) % state.loopLength});
    case 'START_RECORD':
      const startedTrack = {start: state.currentPosition};
      return Object.assign({}, state, {tracks: [...state.tracks, startedTrack]});
    case 'FINISH_RECORD':
      const start = state.tracks[state.tracks.length - 1].start;
      const finishedTrack = {
        start: start,
        end: start + action.record.buffer.duration,
        audioBuffer: action.record.buffer
      };
      // if its the first recorded track - lets reset the global loop length to it
      const loopLength = state.tracks.length === 1 ? finishedTrack.end - finishedTrack.start : state.loopLength;
      return Object.assign({}, state, {tracks: [...state.tracks.slice(0, -1), finishedTrack]}, {loopLength});
    default:
      return state;
  }
};

const initialState = {
  // in seconds
  // lets make it very high so we have enough time for the first track
  loopLength: 30,
  tracks: [],
  currentPosition: 0
};

const store = createStore(reducer, initialState);

module.exports = store;
