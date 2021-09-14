import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

export default class CoursePageLeaderboardEntryComponent extends Component {
  get progressNumerator() {
    return this.args.entry.activeCourseStage.position - 1;
  }

  get progressDenominator() {
    return this.args.entry.activeCourseStage.course.stages.length;
  }

  get progressPercentage() {
    return 100 * (this.progressNumerator / this.progressDenominator);
  }

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressPercentage}%;`);
  }
}
