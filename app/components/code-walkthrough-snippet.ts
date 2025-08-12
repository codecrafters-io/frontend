import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    code: string;
    language: string;
    link: string;
    filePath: string;
    highlightedLines: string;
  };
}

export default class CodeWalkthroughSnippet extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CodeWalkthroughSnippet: typeof CodeWalkthroughSnippet;
  }
}
