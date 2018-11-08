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
    case 'CHANGE_MIX':
      return {
        ...state,
        mix: action.value
      };
    case 'CHANGE_LOWPASS':
      return {
        ...state,
        lowpass: action.value
      };
    case 'CHANGE_READER_1_POSITION':
      return {
        ...state,
        reader1Position: action.value
      };
    case 'AUDIO_BUFFER_LOADED':
      return {
        ...state,
        audioBuffer: action.audioBuffer
      };

    default:
      return state;
  }
};

export default tapeApp;
