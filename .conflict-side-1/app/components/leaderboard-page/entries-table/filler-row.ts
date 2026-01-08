import Component from '@glimmer/component';

interface Signature {
  Element: HTMLTableRowElement;

  Args: {
    text: string;
  };
}

export default class LeaderboardPageEntriesTableFillerRow extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::FillerRow': typeof LeaderboardPageEntriesTableFillerRow;
  }
}
