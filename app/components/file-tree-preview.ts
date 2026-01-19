import Component from '@glimmer/component';
import type { FileTreeFolderItem } from './file-tree-preview/types';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    rootFolder: FileTreeFolderItem;
  };
}

export default class FileTreePreview extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileTreePreview: typeof FileTreePreview;
  }
}
