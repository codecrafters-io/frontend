import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CoursePageContentStepListSetupItemComponent extends Component {
  @service store;
  @tracked createdRepository;

  @action
  handleLanguageSelection(language) {
    let repository = this.store.createRecord('repository', {
      course: this.args.course,
      language: language,
    });

    repository.save();
    this.createdRepository = repository;
  }
}
