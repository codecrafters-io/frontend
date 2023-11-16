// app/modifiers/on-sticky-update.js
import { modifier } from 'ember-modifier';

const onStickyChange = modifier(function onStickyUpdate(element, [callback]: [(isSticky: boolean) => void]) {
  const checkSticky = () => {
    const isSticky = window.getComputedStyle(element).position === 'sticky' && element.getBoundingClientRect().top <= 0;
    callback(isSticky);
  };

  window.addEventListener('scroll', checkSticky);
  checkSticky(); // Initial check

  return () => {
    window.removeEventListener('scroll', checkSticky);
  };
});

export default onStickyChange;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'on-sticky-change': typeof onStickyChange;
  }
}
