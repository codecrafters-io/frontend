import Component from '@glimmer/component';
import _ from 'lodash';
import { tracked } from '@glimmer/tracking';

export default class AdminCourseSubmissionsPageTimelineContainerComponent extends Component {
  @tracked selectedSubmission = null;

  constructor() {
    super(...arguments);

    this.selectedSubmission = this.args.submissions.sortBy('createdAt').lastObject;
  }

  get groupedSubmissions() {
    return _.groupBy(this.args.submissions.toArray().sortBy('createdAt').reverse(), (submission) => {
      return submission.createdAt.toISOString().slice(0, 10);
    });
  }
}
