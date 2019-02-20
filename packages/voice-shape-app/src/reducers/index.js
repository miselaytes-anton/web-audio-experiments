import {extractFeatures} from '../audio';
import {removeSilence, signalToBuffer} from 'web-audio-utils';

const voiceApp = (state, action) => {
  switch (action.type) {
    case 'RECORD_FINISHED':
      //eslint-disable-next-line
      let noSilenceSignal = removeSilence(
        action.audioBuffer.getChannelData(0),
        action.audioBuffer.sampleRate,
        {threshold: -80, minSilenceDuration: 500}
      );
      return {
        ...state,
        audioBuffer: signalToBuffer(state.audioContext, noSilenceSignal),
        features: extractFeatures(noSilenceSignal, action.audioBuffer.sampleRate)
      };
    default:
      return state;
  }
};

export default voiceApp;
