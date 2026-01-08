import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    markdown: string;
  };
}

export default class MarkdownStream extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MarkdownStream: typeof MarkdownStream;
  }
}
