import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
}

export default class ContestStatusPillComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::ContestStatusPill': typeof ContestStatusPillComponent;
  }
}
