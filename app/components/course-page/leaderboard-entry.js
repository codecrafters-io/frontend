import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CoursePageLeaderboardEntryComponent extends Component {
  @service currentUser;

  @action
  handleClick() {
    window.open(this.args.entry.user.githubProfileUrl, '_blank');
  }

  get isForCurrentUser() {
    return this.args.entry.user.id === this.currentUser.record.id;
  }

  get progressNumerator() {
    if (this.args.entry.statusIsCompleted) {
      return this.args.entry.currentCourseStage.position;
    } else {
      return this.args.entry.currentCourseStage.position - 1;
    }
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
