const {createStore} = require('redux');

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_POSITION':
      const positionChange = 1 / 60;
      return Object.assign({}, state, {currentPosition: state.currentPosition + positionChange});
    case 'START_RECORD':
      const startedTrack = {start: state.currentPosition};
      return Object.assign({}, state, {tracks: [...state.tracks, startedTrack]});
    case 'FINISH_RECORD':
      const finishedTrack = {
        start: state.tracks[state.tracks.length - 1].start,
        duration: action.record.buffer.duration * state.loopLength / 10,
        audioBuffer: action.record.buffer
      };
      return Object.assign({}, state, {tracks: [...state.tracks.slice(0, -1), finishedTrack]});
    default:
      return state;
  }
};

const initialState = {
  //in seconds
  loopLength: 10,
  tracks: [],
  currentPosition: 0
};

const store = createStore(reducer, initialState);

module.exports = store;
