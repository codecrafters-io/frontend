import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Blocks: {
    default: [];
  };
}

export default class MobileCloseButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Sidebar::MobileCloseButton': typeof MobileCloseButtonComponent;
  }
}
