export const changeParamValue = (param, value) => {
  return {
    type: `CHANGE_${param.toUpperCase()}`,
    value,
  };
};

export const audioBufferLoaded = (audioBuffer) => {
  return {
    type: 'AUDIO_BUFFER_LOADED',
    audioBuffer,
  };
};

export const audioBufferLoading = () => {
  return {
    type: 'AUDIO_BUFFER_LOADING',
  };
};

