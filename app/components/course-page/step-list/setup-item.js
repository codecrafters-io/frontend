import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageContentStepListSetupItemComponent extends Component {
  @tracked createdRepository;
  @tracked isCreatingRepository;
  @service store;

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
  }
}
