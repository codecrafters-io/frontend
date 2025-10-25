import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class FileTreePreview extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileTreePreview: typeof FileTreePreview;
  }
}
