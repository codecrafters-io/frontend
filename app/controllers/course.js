import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import config from 'codecrafters-frontend/config/environment';

export default class CourseController extends Controller {
  queryParams = [
    {
      selectedRepositoryId: 'repo',
      isCreatingNewRepository: 'fresh',
      track: 'track',
    },
  ];

  @tracked isCreatingNewRepository = false;
  @tracked selectedRepositoryId;
  @tracked newRepository;
  @tracked track;
  @service currentUser;
  @service store;

  get activeRepository() {
    if (this.selectedRepositoryId) {
      return this.repositories.findBy('id', this.selectedRepositoryId);
    } else if (this.isCreatingNewRepository) {
      return this.newRepository;
    } else if (this.track) {
      return this.lastPushedRepositoryForTrack || this.newRepository;
    } else {
      return this.lastPushedRepository || this.newRepository;
    }
  }

  get course() {
    return this.model.courses.findBy('slug', this.model.courseSlug);
  }

  @action
  handleRepositoryCreate() {
    this.track = null;
    this.selectedRepositoryId = this.newRepository.id;
    this.isCreatingNewRepository = false;
    this.newRepository = this.store.createRecord('repository', { course: this.course, user: this.currentUser.record });
  }

  get isDevelopmentOrTest() {
    return config.environment !== 'production';
  }

  get lastPushedRepository() {
    return this.repositories.filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt').lastObject;
  }

  get lastPushedRepositoryForTrack() {
    return this.repositories.filterBy('language.slug', this.track).filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt').lastObject;
  }

  get repositories() {
    return this.currentUser.record.repositories.filterBy('course', this.course).without(this.newRepository);
  }
}
