export const recordFinished = (audioBuffer) => {
  return {
    type: 'RECORD_FINISHED',
    audioBuffer,
  };
};

