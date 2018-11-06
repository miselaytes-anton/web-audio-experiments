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
    default:
      return state;
  }
};

export default tapeApp;
