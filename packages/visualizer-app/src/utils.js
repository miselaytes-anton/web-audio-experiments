export const mapRange = (fromRange, toRange, number) =>
  (number - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];

export const mapParamRange = (rangesFrom, rangesTo) =>
  (fromParam, toParam, v) => mapRange(rangesFrom[fromParam], rangesTo[toParam], v);

export const getLogger = () => {
  let logged = 0;
  return (msg, times) => {
    if (logged < times) {
      console.log(msg);
      logged = logged + 1;
    }
  };
}

export const sum = arr => arr.reduce((sum, curr) => sum + curr, 0);
export const avg = arr => sum(arr) / arr.length;
