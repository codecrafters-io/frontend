import { modifier } from 'ember-modifier';

interface Signature {
  Args: {
    Positional: [];
  };
}

const donutProgress = modifier<Signature>(function donutProgress(element: Element) {
  const targetOffset = element.getAttribute('data-target-offset');

  if (targetOffset && element instanceof SVGElement) {
    element.style.setProperty('--target-offset', targetOffset);
  }
});

export default donutProgress;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'donut-progress': typeof donutProgress;
  }
}
