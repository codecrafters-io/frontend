import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    color: 'gray' | 'green' | 'red' | 'yellow';
  };
}

export default class BlinkingDot extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BlinkingDot: typeof BlinkingDot;
  }
}
