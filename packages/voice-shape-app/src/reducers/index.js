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
      //eslint-disable-next-line
      let noSilenceBuffer = signalToBuffer(state.audioContext, noSilenceSignal);
      return {
        ...state,
        audioBuffer: noSilenceBuffer,
        features: extractFeatures(noSilenceSignal)
      };
    default:
      return state;
  }
};

export default voiceApp;
