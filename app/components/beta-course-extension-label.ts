import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
}

export default class BetaCourseExtensionLabel extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BetaCourseExtensionLabel: typeof BetaCourseExtensionLabel;
  }
}
