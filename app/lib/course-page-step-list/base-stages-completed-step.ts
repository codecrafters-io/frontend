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
    return !this.repository.course.hasExtensions || !this.repository.baseStagesAreComplete;
  }

  get progressIndicator(): ProgressIndicator {
    return {
      dotColor: 'green',
      dotType: 'static',
      text: 'Congratulations!',
    };
  }

  get routeParams() {
    return {
      route: 'course.base-stages-completed',
      models: [this.repository.course.slug],
    };
  }

  get status() {
    if (this.repository.activatedCourseExtensions.length > 0) {
      return 'complete';
    } else {
      return 'not_started';
    }
  }

  get title() {
    return 'Base stages complete!';
  }

  get type(): 'BaseStagesCompletedStep' {
    return 'BaseStagesCompletedStep';
  }
}
