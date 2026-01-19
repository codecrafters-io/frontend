import FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SetupStep extends StepDefinition {
  @service declare featureFlags: FeatureFlagsService;

  @tracked repository: RepositoryModel;

  constructor(repository: RepositoryModel) {
    super();
    this.repository = repository;
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotType: 'none',
        text: this.featureFlags.canViewCLIPingFlow ? 'Ping received.' : 'Git push received.',
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'yellow',
        dotType: 'blinking',
        text: this.featureFlags.canViewCLIPingFlow ? 'Listening for ping...' : 'Listening for a git push...',
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
    return 'Repository Setup';
  }

  get type(): 'SetupStep' {
    return 'SetupStep';
  }
}
