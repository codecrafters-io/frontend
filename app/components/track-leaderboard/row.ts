import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    entry: LeaderboardEntryModel;
    rank: number;
  };
}

export default class TrackLeaderboardRow extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get isCurrentUser(): boolean {
    return this.args.entry.user.id === this.authenticator.currentUserId;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackLeaderboard::Row': typeof TrackLeaderboardRow;
  }
}
