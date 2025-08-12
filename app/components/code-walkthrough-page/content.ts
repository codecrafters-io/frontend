import Component from '@glimmer/component';
import type CodeWalkthroughModel from 'codecrafters-frontend/models/code-walkthrough';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    codeWalkthrough: CodeWalkthroughModel;
  };
}

export default class Content extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CodeWalkthroughPage::Content': typeof Content;
  }
}
