import Component from '@glimmer/component';
import { action } from '@ember/object';
import fade from 'ember-animated/transitions/fade';
import type { Faq } from './collapsible-faq-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    faq: Faq;
    onToggle: (faq: Faq) => void;
    isOpen: boolean;
  };
}

export default class CollapsibleFaqListItem extends Component<Signature> {
  transition = fade;

  @action
  toggleItem() {
    this.args.onToggle(this.args.faq);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CollapsibleFaqListItem: typeof CollapsibleFaqListItem;
  }
}
