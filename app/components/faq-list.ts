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

export default class FaqListComponent extends Component<Signature> {
  @tracked openItem: Faq | null = null;

  faqs: Faq[] = [
    {
      query: 'How many challenges do you offer?',
      answerMarkdown: `We have over 250 stages split across 10 challenges which you can attempt in 22 programming languages. Here's what you'll be building:


* Build Your Own Redis
* Build Your Own Git
* Build Your Own SQLite
* Build Your Own grep
* Build Your Own BitTorrent
* Build Your Own HTTP Server
* Build Your Own DNS Server
* Build Your Own Shell
* Build Your Own Interpreter
* Build Your Own Kafka

If we launch new challenges during your membership, you get access to those too. Visit [our catalog](https://app.codecrafters.io/catalog) to check each individual challenge in detail.`,
    },
    {
      query: 'Why the Team Plan over the Individual Membership?',
      answerMarkdown: 'The Team Plan gives you swappable spots to share among your team. Finished all challenges? Pass your spot to a teammate.',
    },
    {
      query: 'Is there a free trial?',
      answerMarkdown: `We always have at least one challenge available for free. You can easily find them highlighted in [our catalog](https://app.codecrafters.io/catalog).

Additionally, you can explore the detailed breakdowns of all our challenges without signing up. You can also view the task descriptions for every challenge without hitting a paywall.`,
    },
    {
      query: 'Is there a recurring payment?',
      answerMarkdown: 'Nope, just a one-time payment for unlimited access during your membership period.',
    },
    {
      query: 'How about refunds?',
      answerMarkdown:
        "We don't offer refunds. You can freely explore our curriculum without a paywall, and also test drive a couple of stages per course, without providing any card details.",
    },
    {
      query: "This is great but it's too expensive",
      answerMarkdown: `We understand the cost consideration today but investing in your technical skills is one of the highest ROI activities you can do. It has a direct impact on your earning potential.

We've spoken with hundreds of our paid users about their experience before CodeCrafters. They'd spend weeks window-shopping for project ideas, trying to piece together resources, getting lost in "tutorial hell", and realizing too late that their plans missed key details. Instead of wasting weeks or sometimes months' worth of time, our users prefer to start right away with CodeCrafters, pushing code, refining their skills, and following our proven, battle-tested guidance.

If you're early in your career or still a student working with limited budgets, focusing on foundational skills might be more appropriate before investing in CodeCrafters, which is designed for those who already have a job and are ready to push their limits.

Many companies allow employees to expense CodeCrafters as part of their learning and development budget, yours might too. [Read more about that here](https://codecrafters.io/expense).`,
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
