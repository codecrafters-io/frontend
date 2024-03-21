import Component from '@glimmer/component';

type Signature = {
  Element: HTMLDivElement;

  Blocks: {
    default: [];
  };
};

export default class VerticalTabListComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    VerticalTabList: typeof VerticalTabListComponent;
  }
}
