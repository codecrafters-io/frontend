import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageContentStepListSetupItemComponent extends Component {
  @tracked createdRepository;
  @tracked isCreatingRepository;
  @service store;
  @service visibility;
  repositoryPoller;
  transition = fade;

  @action
  async handleDidInsert() {
    this.repositoryPoller = new RepositoryPoller({ store: this.store, visibilityService: this.visibility });
  }

  @action
  async handleWillDestroy() {
    this.repositoryPoller.stop();
  }

  @action
  async handleLanguageSelection(language) {
    this.isCreatingRepository = true;

    let repository = this.store.createRecord('repository', {
      course: this.args.course,
      language: language,
    });

    await repository.save();

    this.createdRepository = repository;
    this.isCreatingRepository = false;

    this.repositoryPoller.start(this.createdRepository, this.onPoll);
  }

  @action
  async onPoll() {
    if (this.isComplete) {
      this.args.onComplete();
      this.repositoryPoller.stop();
    }
  }

  get isComplete() {
    return this.createdRepository && this.createdRepository.firstSubmissionCreated;
  }
}
