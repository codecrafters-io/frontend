module.exports = function (/* environment */) {
  return {
    /*
      Some of the modern types/methods, such as AbortController, need to be
      explicitly passed to FastBoot's "sandbox globals" to be available to code
      executed by FastBoot.
      See these for more info:
      - https://github.com/ember-fastboot/ember-cli-fastboot#fastboot-configuration
      - https://github.com/ember-fastboot/ember-cli-fastboot/issues/913
      - https://discuss.emberjs.com/t/abortcontroller-errors-after-update/20259/4
    */
    buildSandboxGlobals(defaultGlobals) {
      return Object.assign({}, defaultGlobals, {
        AbortController,
      });
    },
  };
};
