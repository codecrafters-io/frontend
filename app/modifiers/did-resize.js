import { modifier } from 'ember-modifier';

export default modifier(function didResize(element, [callback]) {
  let resizeObserver = new ResizeObserver(() => {
    callback();
  });

  resizeObserver.observe(element);

  // Cleanup function
  return () => {
    resizeObserver.disconnect();
    resizeObserver = null;
  };
});
