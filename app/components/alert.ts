import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
}

export default class AlertComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Alert: typeof AlertComponent;
  }
}
