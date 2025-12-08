import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export type Faq = {
  query: string;
  answerMarkdown: string;
};

interface Signature {
  Element: HTMLDivElement;
}

export default class GiftPaymentPageFaqList extends Component<Signature> {
  @tracked openItem: Faq | null = null;

  faqs: Faq[] = [
    {
      query: 'How does gifting work?',
      answerMarkdown: `After completing your purchase, you'll receive a unique gift link via email. You can share this link with the recipient whenever you're ready. When they click the link, they can redeem the gift and start their CodeCrafters membership.`,
    },
    {
      query: 'When does the membership start?',
      answerMarkdown: `The membership period begins when the recipient redeems the gift, not when you purchase it. This means you can purchase a gift now and the recipient can redeem it whenever they're ready.`,
    },
    {
      query: 'Can I edit the gift message after purchase?',
      answerMarkdown: `Yes! You can edit the gift message after purchase. Once you receive the gift link, you'll have access to manage the gift details.`,
    },
    {
      query: "What happens if the gift isn't redeemed?",
      answerMarkdown: `The gift link remains valid until it's redeemed. There's no expiration on when the recipient needs to redeem it, so they can use it whenever they're ready.`,
    },
    {
      query: 'Can I get a refund?',
      answerMarkdown: `We don't offer refunds for gift purchases. However, if you run into any issues, please reach out to us at [hello@codecrafters.io](mailto:hello@codecrafters.io) and we'll be happy to help.`,
    },
    {
      query: 'What if I need to change the recipient?',
      answerMarkdown: `You can share the gift link with anyone you'd like. The gift isn't tied to a specific email address, so you can send it to whomever you choose.`,
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
    'GiftPaymentPage::FaqList': typeof GiftPaymentPageFaqList;
  }
}
