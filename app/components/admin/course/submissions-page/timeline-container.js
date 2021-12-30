import Component from '@glimmer/component';
import _ from 'lodash';

export default class AdminCourseSubmissionsPageTimelineContainerComponent extends Component {
  get groupedSubmissions() {
    return _.groupBy(this.args.submissions.toArray().sortBy('createdAt').reverse(), (submission) => {
      return submission.createdAt.toISOString().slice(0, 10);
    });
  }
}
