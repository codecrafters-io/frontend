import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseLeaderboardEntryComponent extends Component {
  @service authenticator;

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
    return this.args.entry.currentCourseStage.course.stages.length;
  }
}
