import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    emoji: string;
    isSelected: boolean;
  };
}

export default class SentimentOption extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'FeedbackButton::SentimentOption': typeof SentimentOption;
  }
}
