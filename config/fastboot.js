module.exports = function (/* environment */) {
  return {
    buildSandboxGlobals(defaultGlobals) {
      return Object.assign({}, defaultGlobals, {
        AbortController,
      });
    },
  };
};
