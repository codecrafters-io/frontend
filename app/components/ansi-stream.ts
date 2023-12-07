import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    content: string;
  };
}

export default class AnsiStreamComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AnsiStream: typeof AnsiStreamComponent;
  }
}
