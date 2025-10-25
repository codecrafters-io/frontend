import Component from '@glimmer/component';
import type { FileTreeFileItem } from './types';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    item: FileTreeFileItem;
  };
}

export default class FileTreePreviewFileItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'FileTreePreview::FileItem': typeof FileTreePreviewFileItem;
  }
}
