// app/modifiers/on-sticky-update.js
import { modifier } from 'ember-modifier';

export default modifier(function onStickyUpdate(element, [callback]: [(isSticky: boolean) => void]) {
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
