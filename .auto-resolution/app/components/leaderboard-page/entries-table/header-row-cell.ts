import Component from '@glimmer/component';

interface Signature {
  Element: HTMLTableCellElement;

  Args: {
    alignment: 'left' | 'right';
    explanationMarkdown?: string;
    title: string;
  };
}

export default class HeaderRowCell extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::HeaderRowCell': typeof HeaderRowCell;
  }
}
