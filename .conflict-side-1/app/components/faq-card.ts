import Component from '@glimmer/component';
import { action } from '@ember/object';
import type { Faq } from './pricing-page/faq-list';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    faq: Faq;
    onToggle: (faq: Faq) => void;
    isOpen: boolean;
  };
}

export default class FaqCard extends Component<Signature> {
  transition = fade;

  @action
  toggleItem() {
    this.args.onToggle(this.args.faq);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FaqCard: typeof FaqCard;
  }
}
