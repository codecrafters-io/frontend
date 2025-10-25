import Component from '@glimmer/component';
import type { FileTreeFolderItem } from './types';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    item: FileTreeFolderItem;
  };
}

export default class FileTreePreviewFolderItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'FileTreePreview::FolderItem': typeof FileTreePreviewFolderItem;
  }
}
