import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/lib/course-page-step-list/progress-indicator';
import { tracked } from '@glimmer/tracking';

export default class SetupStep extends Step {
  @tracked repository;

  constructor(repository: unknown, position: number) {
    super(position);

    this.repository = repository;
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotColor: 'green',
        dotType: 'static',
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

  get status() {
    // @ts-ignore
    if (this.repository.firstSubmissionCreated) {
      return 'complete';
    }

    // @ts-ignore
    if (this.repository.isNew || !this.repository.onboardingQuestionnaireSubmission.isComplete) {
      return 'locked';
    }

    return 'in_progress';
  }

  get routeParams() {
    return {
      route: 'course.setup',
      // @ts-ignore
      models: [this.repository.course.slug],
    };
  }

  get title() {
    return 'Repository Setup';
  }

  get type(): 'SetupStep' {
    return 'SetupStep';
  }
}
