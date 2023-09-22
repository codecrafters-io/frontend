import { SafeString } from '@ember/template/-private/handlebars';
import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    content: SafeString;
    imageUrl: string;
    title: string;
  };
}

export default class FeatureCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FeatureCard: typeof FeatureCardComponent;
  }
}
