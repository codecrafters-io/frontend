import Component from '@glimmer/component';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLAnchorElement;

  Args: {
    entry: LeaderboardEntryModel;
  };
};

export default class ContestPageLeaderboardEntryComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get isCurrentUserEntry(): boolean {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.args.entry.user.id === this.authenticator.currentUser.id;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::LeaderboardEntry': typeof ContestPageLeaderboardEntryComponent;
  }
}
