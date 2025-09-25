import { modifier } from 'ember-modifier';

export default modifier(function donutProgress(element: SVGElement) {
  const targetOffset = element.getAttribute('data-target-offset');

  if (targetOffset) {
    element.style.setProperty('--target-offset', `${targetOffset}px`);
  }
});
