import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { tracked } from '@glimmer/tracking';

export default class SetupStep extends StepDefinition {
  @tracked repository: RepositoryModel;

  constructor(repository: RepositoryModel) {
    super();
    this.repository = repository;
  }

  get completionModalTitle(): string {
    return 'Local setup complete!';
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotType: 'none',
        text: 'Ping received.',
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'yellow',
        dotType: 'blinking',
        text: 'Listening for ping...',
      };
    } else if (this.status === 'locked') {
      return {
        dotType: 'none',
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
      models: [this.repository.course.slug],
    };
  }

  get status() {
    if (this.repository.firstSubmissionCreated) {
      return 'complete';
    }

    // @ts-expect-error repository properties not typed
    if (this.repository.isNew || !this.repository.preChallengeAssessmentSectionList.isComplete) {
      return 'locked';
    }

    return 'in_progress';
  }

  get title() {
    return 'Local Setup';
  }

  get type(): 'SetupStep' {
    return 'SetupStep';
  }
}
