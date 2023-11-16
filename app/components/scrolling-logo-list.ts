import Component from '@glimmer/component';

interface ScrollingLogoListSignature {
  Element: HTMLDivElement;

  Args: {
    images: { name: string; url: string }[];
  };
}

export default class ScrollingLogoListComponent extends Component<ScrollingLogoListSignature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ScrollingLogoList: typeof ScrollingLogoListComponent;
  }
}
