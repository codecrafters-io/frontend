import Component from '@glimmer/component';
import LanguageModel from 'codecrafters-frontend/models/language';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type Store from '@ember-data/store';
import type UserModel from 'codecrafters-frontend/models/user';
import uniqFieldReducer from 'codecrafters-frontend/utils/uniq-field-reducer';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    courses: CourseModel[];
  };

  Blocks: {
    cta?: [];
  };
}

export default class TrackPageHeader extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  get currentUserHasStartedTrack() {
    return this.authenticator.currentUser && this.authenticator.currentUser.repositories.filter((item) => item.language === this.args.language)[0];
  }

  get topParticipants(): UserModel[] {
    const leaderboard = this.args.language.leaderboard;

    if (!leaderboard) {
      return [];
    }

    return (this.store.peekAll('leaderboard-entry') as unknown as LeaderboardEntryModel[])
      .filter((entry) => entry.leaderboard?.id === leaderboard.id)
      .filter((entry) => !entry.isBanned)
      .sort((a, b) => b.score - a.score)
      .reduce(uniqFieldReducer('user'), [])
      .slice(0, 3)
      .map((entry) => entry.user);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::Header': typeof TrackPageHeader;
  }
}
