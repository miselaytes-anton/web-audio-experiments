'use strict';

module.exports = (state = {}, action) => {
  switch (action.type) {
    case 'SET_VOLUME':
      return Object.assign({}, state, {volume: action.node});
    case 'SET_DISTORTION':
      return Object.assign({}, state, {distortion: action.node});
    default:
      return state;
  }
}
