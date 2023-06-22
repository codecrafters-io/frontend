import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class CourseLeaderboardEntryComponent extends Component {
  @service authenticator;

  get isForCurrentUser() {
    return this.authenticator.isAuthenticated && this.args.entry.user.id === this.authenticator.currentUserId;
  }

  get progressNumerator() {
    return this.args.entry.completedStagesCount;
  }

  get progressDenominator() {
    return this.args.entry.currentCourseStage.course.stages.length;
  }

  get progressPercentage() {
    return 100 * (this.progressNumerator / this.progressDenominator);
  }

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressPercentage}%;`);
  }
}
