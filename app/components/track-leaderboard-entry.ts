import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type TrackLeaderboardEntryModel from 'codecrafters-frontend/models/track-leaderboard-entry';
import type Store from '@ember-data/store';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    entry?: TrackLeaderboardEntryModel;
  };
}

export default class TrackLeaderboardEntryComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  get isForCurrentUser() {
    if (this.isSkeleton) {
      return false;
    }

    return this.authenticator.isAuthenticated && this.args.entry!.user.id === this.authenticator.currentUserId;
  }

  get isSkeleton() {
    return !this.args.entry;
  }

  get progressDenominator() {
    return this.store
      .peekAll('course')
      .rejectBy('releaseStatusIsAlpha')
      .filter((course: CourseModel) => course.betaOrLiveLanguages.includes(this.args.entry!.language as LanguageModel))
      .mapBy('stages.length')
      .reduce((a, b) => a + b, 0);
  }

  get progressNumerator() {
    return this.args.entry!.completedStagesCount;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TrackLeaderboardEntry: typeof TrackLeaderboardEntryComponent;
  }
}
