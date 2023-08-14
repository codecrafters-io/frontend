import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title?: string;
  };

  Blocks: {
    content: [];
    footer: [];
  };
}

export default class InstructionsCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::InstructionsCard': typeof InstructionsCardComponent;
  }
}
