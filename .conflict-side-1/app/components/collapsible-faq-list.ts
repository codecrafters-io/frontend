import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export type Faq = {
  question_markdown: string;
  answer_markdown: string;
};

interface Signature {
  Element: HTMLDivElement;

  Args: {
    faqs: Faq[];
  };
}

export default class CollapsibleFaqList extends Component<Signature> {
  @tracked openFaqItem: Faq | null = null;

  @action
  handleFaqToggle(faq: Faq) {
    if (this.openFaqItem === faq) {
      this.openFaqItem = null;
    } else {
      this.openFaqItem = faq;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CollapsibleFaqList: typeof CollapsibleFaqList;
  }
}
