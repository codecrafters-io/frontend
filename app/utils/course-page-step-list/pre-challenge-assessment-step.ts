import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import { tracked } from '@glimmer/tracking';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class PreChallengeAssessmentStep extends Step {
  @tracked repository: RepositoryModel;

  constructor(repository: RepositoryModel) {
    super();

    this.repository = repository;
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.status === 'complete') {
      return {
        dotType: 'none',
        text: 'Pre-challenge assessment complete.',
      };
    } else {
      return {
        dotType: 'none',
        text: 'Complete pre-challenge assessment to proceed',
      };
    }
  }

  get routeParams() {
    return {
      route: 'course.pre-challenge-assessment',
      models: [this.repository.course.slug],
    };
  }

  get status() {
    if (!this.repository.language) {
      return 'locked';
    }

    return this.repository.preChallengeAssessmentSectionList.isComplete ? 'complete' : 'in_progress';
  }

  get title() {
    return 'Pre-challenge assessment';
  }

  get type(): 'PreChallengeAssessmentStep' {
    return 'PreChallengeAssessmentStep';
  }
}
