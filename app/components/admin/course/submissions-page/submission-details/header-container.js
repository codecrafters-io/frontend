import Component from '@glimmer/component';

export default class AdminCourseSubmissionsPageSubmissionDetailsHeaderContainerComponent extends Component {
  get formattedDuration() {
    if (this.args.submission.evaluations.firstObject) {
      return `${this.durationInMilliseconds / 1000} seconds`;
    } else {
      return '-';
    }
  }

  get durationInMilliseconds() {
    return this.args.submission.evaluations.firstObject.createdAt.getTime() - this.args.submission.createdAt.getTime();
  }
}
