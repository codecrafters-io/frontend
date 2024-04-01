'use strict';

// TODO: There has to be a cleaner way to do this???
// @ts-ignore
// eslint-disable-next-line no-undef
module.exports = function (fileName, contents) {
  return {
    apply: (compiler) => {
      compiler.hooks.emit.tapAsync('VersionFilePlugin', (compilation, callback) => {
        compilation.assets[fileName] = {
          source: function () {
            return contents;
          },
          size: function () {
            return contents.length;
          },
        };
        callback();
      });
    },
  };
};
