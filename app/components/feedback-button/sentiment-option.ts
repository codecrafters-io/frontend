import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isSelected: boolean;
    emoji: string;
  };
}

export default class SentimentOption extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'FeedbackButton::SentimentOption': typeof SentimentOption;
  }
}
