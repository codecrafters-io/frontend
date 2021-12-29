import Component from '@glimmer/component';
import _ from 'lodash';

export default class AdminCourseSubmissionsPageTimelineContainerComponent extends Component {
  get groupedSubmissions() {
    console.log(this.args.submissions.length);
    console.log(this.args.submissions.firstObject.createdAt);
    console.log(
      _.groupBy(this.args.submissions.toArray(), (submission) => {
        return submission.createdAt.toISOString().slice(0, 10);
      })
    );
    return _.groupBy(this.args.submissions.toArray(), (submission) => {
      return submission.createdAt.toISOString().slice(0, 10);
    });
  }
}
