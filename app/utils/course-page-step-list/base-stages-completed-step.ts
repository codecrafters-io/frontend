import { tracked } from '@glimmer/tracking';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';

export default class BaseStagesCompletedStep extends Step {
  @tracked repository;

  constructor(repository: RepositoryModel) {
    super();

    this.repository = repository;
  }

  get isHidden() {
    return !this.repository.course.hasExtensions || !this.repository.baseStagesAreComplete;
  }

  get progressIndicator(): ProgressIndicator {
    return {
      dotType: 'none',
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
