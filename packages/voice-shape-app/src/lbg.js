const {sum, flatMap, groupBy, values} = require('lodash');

export const max = arr => Math.max(...arr);
export const avg = arr => sum(arr) / arr.length;
const vScale = (arr, scaleC) => arr.map(item => item * scaleC);
const vAdd = vectors => vectors.reduce((vSum, vector) =>
    vector.map((value, i) => value + (vSum[i] || 0)),
  []);
export const vAvg = vectors => vScale(vAdd(vectors), 1 / vectors.length);

/**
 * Split every centroid in two
 * @param {[[number]]} codebook -  an array of codewords (centroids)
 * @param {number} eps - a float
 * @returns {[[number]]} with double the length of codebook array
 */
const splitCentroids = (codebook, eps) => codebook.reduce((codebook, centroid) =>
    codebook.concat([vScale(centroid, 1 + eps), vScale(centroid, 1 - eps)]),
  []
);

const centroidIsStable = (prevDistortion, currDistortion, eps) => (prevDistortion - currDistortion) / prevDistortion < eps;

/**
 * Calculate Euclidian distance between 2 vectors of the same length
 * @param {[]} vector1
 * @param {[]} vector2
 * @returns {number}
 */
const eucDistance = (vector1, vector2) => {
  if (vector1.length !== vector2.length) {
    throw new Error('Vectors must be of the same length');
  }
  return (vector1.reduce((prev, curr, i) => prev + (curr - vector2[i]) ** 2, 0)) ** 0.5;
};

const nearestNeighbor = (point, neighbors) => {
  const distances = neighbors.map(neighbor => eucDistance(point, neighbor));
  const distance = Math.min(...distances);
  const index = distances.indexOf(distance);
  const neighbor = neighbors[index];
  return {distance, index, neighbor};
};
/**
 * cluster features around nearest centroids
 * @param {[[]]} features
 * @param {[[]]} codebook
 * @returns {[[[number]]]} - an array of feature clusters, where each feature is an array of 13 numbers
 */
const cluster = (features, codebook) => values(groupBy(features, feature => nearestNeighbor(feature, codebook).index));

/**
 * take a distance of every vector to the nearest centroid, then take the average of that distance
 * @param {[[[number]]]} clusters
 * @param {[[number]]} codebook
 * @returns {number}
 */
const calcDistortion = (clusters, codebook) => {
  const distances = flatMap(clusters, (cluster, i) => {
    const nearestCentroid = codebook[i];
    //cluster becomes an array of distances
    return cluster.map(vector => eucDistance(vector, nearestCentroid));
  });
  return avg(distances);
};

/**
 * The Linde-Buzo-Gray algorithm is a vector quantization algorithm to derive a good codebook.
 * It is similar to the k-means method in data clustering
 * @param {[[number]]} features  - an array of (arrays of mel coefficients)
 * @param {number} m
 * @returns {[[number]]} - an array of centroids, where each centroid is an array of 13 numbers
 */
export const lbg = (features, m = 16) => {
  const eps = 0.01;
  // centroidOfEntireSet is an average of all features (a point in 13 dimensions)
  const centroidOfEntireSet = vAvg(features);
  let codebook = [centroidOfEntireSet];
  while (codebook.length < m) {
    codebook = splitCentroids(codebook, eps);
    let prevDistortion = 1;
    let currDistortion = 1;
    while (!centroidIsStable(prevDistortion, currDistortion, eps)) {
      // recalculate centroids
      const clusters = cluster(features, codebook);
      codebook = clusters.map(vAvg);
      prevDistortion = currDistortion;
      currDistortion = calcDistortion(clusters, codebook);
    }
  }

  return codebook;
};
