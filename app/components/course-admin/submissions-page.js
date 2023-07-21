import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class AdminCourseSubmissionsPageComponent extends Component {
  @tracked selectedSubmission = null;

  constructor() {
    super(...arguments);

    this.selectedSubmission = this.args.submissions.sortBy('createdAt').lastObject;
  }

  get filteringTitle() {
    if (this.args.filteredLanguages.firstObject) {
      return `${this.args.filteredLanguages.mapBy('name').sort().join(' / ')}`;
    } else {
      return `All Languages`;
    }
  }

  get filteringDescription() {
    if (this.args.filteredLanguages.firstObject) {
      return `Showing submissions in ${this.args.filteredLanguages.mapBy('name').sort().join(' / ')}`;
    } else {
      return `Showing submissions in all languages`;
    }
  }
}
