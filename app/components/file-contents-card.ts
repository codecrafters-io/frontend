import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    code: string;
    language: string;
    filename: string;
  };

  Blocks: {};
}

export default class FileContentsCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileContentsCard: typeof FileContentsCardComponent;
  }
}
