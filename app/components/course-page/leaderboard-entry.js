import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default class CoursePageLeaderboardEntryComponent extends Component {
  @service currentUser;

  get isForCurrentUser() {
    return this.args.entry.user.id === this.currentUser.record.id;
  }

  get progressNumerator() {
    return this.args.entry.currentCourseStage.position - 1;
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
