import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import { tracked } from '@glimmer/tracking';

export default class IntroductionStep extends Step {
  @tracked repository;

  constructor(repository: unknown) {
    super();

    this.repository = repository;
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotType: 'none',
        text: 'Language selected.',
      };
    } else {
      return {
        dotType: 'none',
        text: 'Select a language to proceed',
      };
    }
  }

  get routeParams() {
    return {
      route: 'course.introduction',
      // @ts-ignore
      models: [this.repository.course.slug],
    };
  }

  get status() {
    return this.repository.language ? 'complete' : 'not_started';
  }

  get title() {
    return 'Select language';
  }

  get type(): 'IntroductionStep' {
    return 'IntroductionStep';
  }
}
