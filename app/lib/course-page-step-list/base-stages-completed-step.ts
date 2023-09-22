import { tracked } from '@glimmer/tracking';
import type ProgressIndicator from 'codecrafters-frontend/lib/course-page-step-list/progress-indicator';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

export default class BaseStagesCompletedStep extends Step {
  @tracked repository;

  constructor(repository: TemporaryRepositoryModel) {
    super();

    this.repository = repository;
  }

  get isHidden() {
    console.log('this.repository.baseStagesAreComplete', this.repository.baseStagesAreComplete);

    return !this.repository.baseStagesAreComplete;
  }

  get progressIndicator(): ProgressIndicator {
    return {
      dotColor: 'green',
      dotType: 'static',
      text: 'Congratulations!',
    };
  }

  get status(): 'not_started' {
    return 'not_started';
  }

  get routeParams() {
    return {
      route: 'course.base-stages-completed',
      models: [this.repository.course.slug],
    };
  }

  get title() {
    return 'Base stages complete!';
  }

  get type(): 'BaseStagesCompletedStep' {
    return 'BaseStagesCompletedStep';
  }
}
