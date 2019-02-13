import {generate} from '../shape';

const voiceApp = (state, action) => {
  switch (action.type) {
    case 'RECORD_FINISHED':
      return {
        ...state,
        audioBuffer: action.audioBuffer,
        shape: generate(action.audioBuffer.getChannelData(0))
      };
    default:
      return state;
  }
};

export default voiceApp;
