import { modifier } from 'ember-modifier';

interface Signature {
  Args: {
    Positional: [];
  };
}

const progressDonut = modifier<Signature>(function progressDonut(element: Element) {
  const targetOffset = element.getAttribute('data-target-offset');

  if (targetOffset && element instanceof SVGElement) {
    element.style.setProperty('--target-offset', targetOffset);
  }
});

export default progressDonut;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'progress-donut': typeof progressDonut;
  }
}
