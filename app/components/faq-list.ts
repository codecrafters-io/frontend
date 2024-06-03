import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type Faq = {
  query: string;
  answer: string;
};

type Signature = {
  Element: HTMLElement;
};

export default class FaqListComponent extends Component<Signature> {
  @tracked openItem: Faq | null = null;

  faqs: Faq[] = [
    {
      query: "What's included in the individual Membership?",
      answer: 'All our challenges, in every language we support. If we launch new ones during your membership, you can access those too.',
    },
    {
      query: 'Why the Team Plan over the Individual Membership?',
      answer: 'The Team Plan gives you swappable spots to share among your team. Finished all the courses? Pass your spot to a teammate.',
    },
    {
      query: 'Is there a recurring payment?',
      answer: 'Nope, just a one-time payment for unlimited access during your membership period.',
    },
    {
      query: "I'm a student and these prices are too high for me. Do you offer a student discount?",
      answer:
        "We understand that students may be on a tight budget. Our primary target customers are professionals who are short on time and value a well-organised, high-quality learning experience. We encourage students that have time on their side, to try out free resources such as books, tutorials, and videos. You can always join CodeCrafters later when you're ready.",
    },
    {
      query: 'How about refunds?',
      answer:
        "We don't offer refunds. You can freely explore our curriculum without a paywall, and also test drive a couple of stages per course, without providing any card details.",
    },
  ];

  @action
  handleToggle(item: Faq) {
    if (this.openItem === item) {
      this.openItem = null;
    } else {
      this.openItem = item;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FaqList: typeof FaqListComponent;
  }
}
