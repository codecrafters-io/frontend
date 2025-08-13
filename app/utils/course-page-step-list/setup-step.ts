import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import { tracked } from '@glimmer/tracking';

export default class SetupStep extends StepDefinition {
  @tracked repository;

  constructor(repository: unknown) {
    super();
    this.repository = repository;
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotType: 'none',
        text: 'Git push received.',
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'yellow',
        dotType: 'blinking',
        text: 'Listening for a git push...',
      };
      // @ts-ignore
    } else if (this.status === 'locked') {
      return {
        dotType: 'none',
        // @ts-ignore
        text: `Complete introduction step to proceed`,
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
      route: 'course.setup',
      // @ts-ignore
      models: [this.repository.course.slug],
    };
  }

  get status() {
    // @ts-ignore
    if (this.repository.firstSubmissionCreated) {
      return 'complete';
    }

    // @ts-ignore
    if (this.repository.isNew || !this.repository.preChallengeAssessmentSectionList.isComplete) {
      return 'locked';
    }

    return 'in_progress';
  }

  get title() {
    return 'Repository Setup';
  }

  get type(): 'SetupStep' {
    return 'SetupStep';
  }
}
