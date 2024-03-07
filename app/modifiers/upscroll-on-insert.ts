import Modifier from 'ember-modifier';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';

type Signature = {
  Args: {
    Positional: [];

    Named: {
      scrollableContainer?: string;
    };
  };
};

export default class UpscrollOnInsertModifier extends Modifier<Signature> {
  modify(_: Element, _positional: [], named: Signature['Args']['Named']) {
    const { scrollableContainer: scrollableContainerSelector } = named;

    if (!scrollableContainerSelector) {
      scrollToTop(); // Fallback to window scroll if no scrollable container is provided

      return;
    }

    const scrollableContainer = document.querySelector(scrollableContainerSelector);

    if (scrollableContainer) {
      scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'upscroll-on-insert': typeof UpscrollOnInsertModifier;
  }
}
