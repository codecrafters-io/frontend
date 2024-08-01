import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    icon: 'arrow-down' | 'arrow-up';
    text: string;
  };
}

export default class ExpandOrCollapseButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'InstructionsCard::ExpandOrCollapseButton': typeof ExpandOrCollapseButtonComponent;
  }
}
