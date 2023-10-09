import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/lib/course-page-step-list/progress-indicator';
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
        dotColor: 'green',
        dotType: 'static',
        text: 'Introduction complete.',
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'yellow',
        dotType: 'blinking',
        text: 'Complete pre-challenge assessment to proceed',
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
    // @ts-ignore
    if (this.repository.isNew) {
      return 'not_started';
    }

    // Old users don't have a pre-challenge assessment, let's still show this as completed for them.
    // @ts-ignore
    if (this.repository.firstSubmissionCreated) {
      return 'complete';
    }

    // @ts-ignore
    if (this.repository.preChallengeAssessmentSectionList.isComplete) {
      return 'complete';
    }

    return 'in_progress';
  }

  get title() {
    return 'Introduction';
  }

  get type(): 'IntroductionStep' {
    return 'IntroductionStep';
  }
}
