export const changeSpeed = (value) => {
  return {
    type: 'CHANGE_SPEED',
    value,
  };
};

export const changeFeedback = (value) => {
  return {
    type: 'CHANGE_FEEDBACK',
    value,
  };
};

export const changeReaderPosition = (value, reader) => {
  return {
    type: `CHANGE_READER_POSITION_${reader}`,
    value,
  };
};

