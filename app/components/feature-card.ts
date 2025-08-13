import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    contentMarkdown?: string;
    imageUrl: string;
    title: string;
  };

  Blocks: {
    content?: [];
  };
}

export default class FeatureCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FeatureCard: typeof FeatureCard;
  }
}
