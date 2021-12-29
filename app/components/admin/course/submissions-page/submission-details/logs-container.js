import Component from '@glimmer/component';

export default class AdminCourseSubmissionsPageSubmissionDetailsLogsContainerComponent extends Component {
  get evaluation() {
    return this.args.submission.evaluations.firstObject;
  }

  get logLines() {
    console.log(this.evaluation.logs.split('\n'));
    return this.evaluation.logs.split('\n');
  }
}
