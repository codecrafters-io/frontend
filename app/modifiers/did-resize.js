import { modifier } from 'ember-modifier';

/**
 * @param {Element} [element] The DOM element this modifier is applied to
 * @param {[Function]} [params] Positional modifier params
 */
function didResize(element, [changeHandler]) {
  const observer = new ResizeObserver(changeHandler);
  observer.observe(element);

  return function () {
    observer.disconnect();
  };
}

export default modifier(didResize);
