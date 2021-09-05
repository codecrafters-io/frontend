import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class CourseController extends Controller {
  queryParams = [
    {
      selectedRepositoryId: 'repo',
    },
  ];

  @tracked selectedRepositoryId;

  get activeRepository() {
    if (this.selectedRepositoryId) {
      return this.model.repositories.findBy('id', this.selectedRepositoryId);
    } else {
      return this.model.repositories.filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt').lastObject;
    }
  }
}
