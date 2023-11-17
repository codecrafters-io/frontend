import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [scrollParentSelector: string, callback: (isSticky: boolean) => void];
  };
};

const onStickyChange = modifier<Signature>(function onStickyUpdate(element, [scrollParentSelector, callback]: [string, (isSticky: boolean) => void]) {
  const checkSticky = () => {
    const isSticky = window.getComputedStyle(element).position === 'sticky' && element.getBoundingClientRect().top <= 0;
    callback(isSticky);
  };

  const scrollParentElement = document.querySelector(scrollParentSelector);

  if (scrollParentElement) {
    scrollParentElement.addEventListener('scroll', checkSticky);
    checkSticky(); // Initial check
  }

  return () => {
    const scrollParentElement = document.querySelector(scrollParentSelector);

    if (scrollParentElement) {
      scrollParentElement.removeEventListener('scroll', checkSticky);
    }
  };
});

export default onStickyChange;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'on-sticky-change': typeof onStickyChange;
  }
}
