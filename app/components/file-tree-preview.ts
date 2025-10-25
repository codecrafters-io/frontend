import Component from '@glimmer/component';
import type { FileTreeFolderItem } from './file-tree-preview/types';

interface Signature {
  Element: HTMLDivElement;
}

export default class FileTreePreview extends Component<Signature> {
  get rootFolder(): FileTreeFolderItem {
    return {
      type: 'folder',
      name: 'codecrafters-shell-python',
      children: [
        {
          type: 'folder',
          name: 'app',
          children: [
            {
              type: 'file',
              name: 'main.py',
            },
          ],
        },
        {
          type: 'folder',
          name: 'other files',
          isGrayedOut: true,
          children: [
            {
              type: 'file',
              name: 'README.md',
              isGrayedOut: true,
            },
          ],
        },
      ],
    };
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FileTreePreview: typeof FileTreePreview;
  }
}
