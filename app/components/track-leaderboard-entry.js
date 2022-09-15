import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TrackLeaderboardEntryComponent extends Component {
  @service currentUser;
  @service store;

  get isForCurrentUser() {
    return this.currentUser.isAuthenticated && this.args.entry.user.id === this.currentUser.currentUserId;
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
