import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [selector: string, callback: (isSticky: boolean) => void];
  };
};

const onStickyChange = modifier<Signature>(function onStickyUpdate(element, [selector, callback]: [string, (isSticky: boolean) => void]) {
  const checkSticky = () => {
    const isSticky = window.getComputedStyle(element).position === 'sticky' && element.getBoundingClientRect().top <= 0;
    callback(isSticky);
  };

  document.querySelector(selector)!.addEventListener('scroll', checkSticky);
  checkSticky(); // Initial check

  return () => {
    document.querySelector(selector)!.removeEventListener('scroll', checkSticky);
  };
});

export default onStickyChange;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'on-sticky-change': typeof onStickyChange;
  }
}
