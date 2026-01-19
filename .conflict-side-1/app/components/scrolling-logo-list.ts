import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    images: { name: string; url: string }[];
  };
}

export default class ScrollingLogoList extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ScrollingLogoList: typeof ScrollingLogoList;
  }
}
