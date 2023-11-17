import { modifier } from 'ember-modifier';

type Signature = {
  Args: {
    Positional: [callback: (isSticky: boolean) => void];
  };
};

const inViewportDidChange = modifier<Signature>(function inViewportDidChange(element, [callback]: [(isSticky: boolean) => void]) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry) {
        callback(entry.isIntersecting);
      }
    },
    { rootMargin: '0px 0px 0px 0px' },
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
});

export default inViewportDidChange;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'in-viewport-did-change': typeof inViewportDidChange;
  }
}
