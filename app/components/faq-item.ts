import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { Faq } from './faq-list';

type Signature = {
  Element: HTMLElement;

  Args: {
    faq: Faq;
    onToggle: (faq: Faq) => void;
    isOpen: boolean;
  };
};

export default class FaqItemComponent extends Component<Signature> {
  @action
  toggleItem() {
    this.args.onToggle(this.args.faq);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FaqItem: typeof FaqItemComponent;
  }
}
