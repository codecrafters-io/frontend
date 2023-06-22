import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class TrackLeaderboardEntryComponent extends Component {
  @service authenticator;
  @service store;

  get isForCurrentUser() {
    return this.authenticator.isAuthenticated && this.args.entry.user.id === this.authenticator.currentUserId;
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

  get progressPercentage() {
    return 100 * (this.progressNumerator / this.progressDenominator);
  }

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressPercentage}%;`);
  }
}
