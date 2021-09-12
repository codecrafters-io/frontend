import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import config from 'codecrafters-frontend/config/environment';

export default class CourseController extends Controller {
  queryParams = [
    {
      selectedRepositoryId: 'repo',
      isCreatingNewRepository: 'fresh',
    },
  ];

  @tracked isCreatingNewRepository = false;
  @tracked selectedRepositoryId;
  @tracked newRepository;

  get activeRepository() {
    if (this.selectedRepositoryId) {
      return this.model.repositories.findBy('id', this.selectedRepositoryId);
    } else if (this.isCreatingNewRepository) {
      return this.newRepository;
    } else {
      return this.lastPushedRepository || this.newRepository;
    }
  }

  @action
  handleRepositoryCreate() {
    this.selectedRepositoryId = this.newRepository.id;
    this.isCreatingNewRepository = false;

    this.model.repositories.pushObject(this.newRepository);
    this.newRepository = this.store.createRecord('repository', { course: this.model.course });
  }

  get isDevelopmentOrTest() {
    return config.environment !== 'production';
  }

  get lastPushedRepository() {
    return this.model.repositories.filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt').lastObject;
  }
}
