import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageContentStepListSetupItemComponent extends Component {
  @tracked createdRepository;
  @tracked isCreatingRepository;
  @service store;
  transition = fade;

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
    this.args.onRepositoryCreate(repository);
  }

  get isComplete() {
    return this.createdRepository && this.createdRepository.firstSubmissionCreated;
  }
}
