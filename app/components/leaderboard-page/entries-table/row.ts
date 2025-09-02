import Component from '@glimmer/component';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLTableRowElement;

  Args: {
    entry: LeaderboardEntryModel;
    index: number;
  };
}

export default class LeaderboardPageEntriesTableRow extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get isCurrentUser(): boolean {
    return this.args.entry.user === this.authenticator.currentUser;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable::Row': typeof LeaderboardPageEntriesTableRow;
  }
}
