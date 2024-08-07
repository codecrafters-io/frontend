import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    text: string;
    type: 'link' | 'route';
    route: string;
  };
}

export default class LinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::Link': typeof LinkComponent;
  }
}
