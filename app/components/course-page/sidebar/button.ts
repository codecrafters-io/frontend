import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    icon: string;
    text: string;
  };

  Blocks: {
    default: [];
  };
}

export default class ButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Sidebar::Button': typeof ButtonComponent;
  }
}
