import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    icon: string;
  };

  Blocks: {
    default: [];
  };
}

export default class MetadataItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CodeWalkthroughPage::MetadataItem': typeof MetadataItem;
  }
}
