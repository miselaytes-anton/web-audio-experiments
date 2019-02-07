export const clamp = (range, v) => {
  if (v < range[0]) {
    return range[0];
  }
  if (v > range[1]) {
    return range[1];
  }
  return v;
};
export const mapRange = (fromRange, toRange, number) =>
  (clamp(fromRange, number) - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];

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
};

export const sum = arr => arr.reduce((sum, curr) => sum + curr, 0);
export const avg = arr => sum(arr) / arr.length;

export const getFeatureStore = (numStoredFeatures = 5) => {
  const previousFeatures = {};
  const storeFeature = (featureName, featureValue) => {
    if (!previousFeatures[featureName]) {
      previousFeatures[featureName] = [];
    }
    previousFeatures[featureName].push(featureValue);
    if (previousFeatures[featureName].length > numStoredFeatures) {
      previousFeatures[featureName].shift();
    }
  };
  const getFeature = name => avg(previousFeatures[name]);
  return {storeFeature, getFeature};
};
