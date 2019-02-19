
/**
 * Allows to set a parameter value for multiple nodes (of same kind)
    at the same time
 * @param {Array} params - array of audio params
 * @returns {{}}
 */
module.exports = function (params) {
  const singleParam = params[0];
  const parameter = {};
  const audioNodeMethods = Object.getOwnPropertyNames(AudioParam.prototype)
  .filter(prop => typeof singleParam[prop] === 'function');

  //allows things like parameter.setValueAtTime(x, ctx.currentTime)
  audioNodeMethods.forEach(method => {
    parameter[method] = (...argums) => {
      const args = Array.prototype.slice.call(argums);
      params.forEach((param) => {
        singleParam[method].apply(param, args);
      });

    };
  });

  //allows to do parameter.value = x
  Object.defineProperties(parameter, {
    value: {
      get: function () {
        return singleParam.value;
      },
      set: function (value) {
        params.forEach(param => {
          param.value = value;
        });
      }
    }
  });

  return parameter;
}
