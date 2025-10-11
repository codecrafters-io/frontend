import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import { tracked } from '@glimmer/tracking';

export default class IntroductionStep extends StepDefinition {
  @tracked repository;

  constructor(repository: unknown) {
    super();

    this.repository = repository;
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotType: 'none',
        text: 'Introduction complete.',
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'yellow',
        dotType: 'blinking',
        text: 'Complete introduction questionnaire to proceed',
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
      // @ts-expect-error repository.course not typed
      models: [this.repository.course.slug],
    };
  }

  get status() {
    // @ts-expect-error repository.isNew not typed
    if (this.repository.isNew) {
      return 'not_started';
    }

    // Old users don't have a questionnaire, let's still show this as completed for them.
    // @ts-expect-error repository.firstSubmissionCreated not typed
    if (this.repository.firstSubmissionCreated) {
      return 'complete';
    }

    // @ts-expect-error repository.preChallengeAssessmentSectionList not typed
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
