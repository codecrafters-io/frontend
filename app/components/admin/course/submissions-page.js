import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class AdminCourseSubmissionsPageComponent extends Component {
  @tracked selectedSubmission = null;

  constructor() {
    super(...arguments);

    this.selectedSubmission = this.args.submissions.sortBy('createdAt').lastObject;
  }
}
