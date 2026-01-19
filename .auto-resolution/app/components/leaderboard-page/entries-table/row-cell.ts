import Component from '@glimmer/component';

interface Signature {
  Element: HTMLTableCellElement;

  Blocks: {
    default: [];
  };
}

export default class RowCell extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::RowCell': typeof RowCell;
  }
}
