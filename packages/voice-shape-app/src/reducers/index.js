import {extract} from '../features';

const voiceApp = (state, action) => {
  switch (action.type) {
    case 'RECORD_FINISHED':
      return {
        ...state,
        audioBuffer: action.audioBuffer,
        features: extract(action.audioBuffer.getChannelData(0))
      };
    default:
      return state;
  }
};

export default voiceApp;
