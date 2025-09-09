import Component from '@glimmer/component';

interface Signature {
  Element: HTMLTableRowElement;
}

export default class LeaderboardPageEntriesTableSkeletonRow extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::SkeletonRow': typeof LeaderboardPageEntriesTableSkeletonRow;
  }
}
