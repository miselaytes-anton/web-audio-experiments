const tapeApp = (state, action) => {
  switch (action.type) {
    case 'CHANGE_SPEED':
      return {
        ...state,
        tapeSpeed: action.value
      };
    case 'CHANGE_FEEDBACK':
      return {
        ...state,
        feedbackAmount: action.value
      };
    case 'CHANGE_READER_POSITION_1':
      return {
        ...state,
        reader1Position: action.value
      };
    default:
      return state;
  }
};

export default tapeApp;
