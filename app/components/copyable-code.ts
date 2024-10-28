import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    backgroundColor?: 'gray' | 'white';
    code: string;
    onCopyButtonClick?: () => void | Promise<void>;
  };
}

export default class CopyableCodeComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyableCode: typeof CopyableCodeComponent;
  }
}
