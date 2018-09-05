const mapRange = (fromRange, toRange, number) =>
  (number - fromRange[0]) * (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]) + toRange[0];

module.exports = {mapRange};
