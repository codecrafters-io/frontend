import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    code: string;
    language: string;
    filename: string;
    forceDarkTheme?: boolean;
  };
}

export default class FileDiffCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileDiffCard: typeof FileDiffCardComponent;
  }
}
