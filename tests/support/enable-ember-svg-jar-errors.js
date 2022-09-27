// Hack to ensure ember-svg-jar throws errors
let originalWarn;

export default function enableEmberSvgJarErrors(qunit) {
  qunit.begin(function () {
    originalWarn = console.warn;

    console.warn = function (...args) {
      if (args.length > 0 && args[0].startsWith('ember-svg-jar: ')) {
        throw new Error(args[0]);
      }

      originalWarn.call(console, ...args);
    };
  });

  qunit.done(function () {
    console.warn = originalWarn;
  });
}
