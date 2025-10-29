import Component from '@glimmer/component';
import LanguageModel from 'codecrafters-frontend/models/language';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import type UserModel from 'codecrafters-frontend/models/user';

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
    return this.store
      .peekAll('track-leaderboard-entry')
      .filter((item) => item.language === this.args.language)
      .sortBy('completedStagesCount')
      .reverse()
      .uniqBy('user')
      .slice(0, 3)
      .map((item) => item.user);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::Header': typeof TrackPageHeader;
  }
}
