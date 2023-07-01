import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TrackLeaderboardEntryComponent extends Component {
  @service authenticator;
  @service store;

  get isForCurrentUser() {
    if (this.isSkeleton) {
      return false;
    }

    return this.authenticator.isAuthenticated && this.args.entry.user.id === this.authenticator.currentUserId;
  }

  get isSkeleton() {
    return !this.args.entry;
  }

  get progressNumerator() {
    return this.args.entry.completedStagesCount;
  }

  get progressDenominator() {
    return this.store
      .peekAll('course')
      .rejectBy('releaseStatusIsAlpha')
      .filter((course) => course.betaOrLiveLanguages.includes(this.args.entry.language))
      .mapBy('stages.length')
      .reduce((a, b) => a + b, 0);
  }
}
