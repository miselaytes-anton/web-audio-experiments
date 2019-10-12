const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  };

const getRandomInt = (_min, _max) => {
const min = Math.ceil(_min);
const max = Math.floor(_max);
//The maximum is exclusive and the minimum is inclusive
return Math.floor(Math.random() * (max - min)) + min;
};

export {getRandomArbitrary, getRandomInt};
