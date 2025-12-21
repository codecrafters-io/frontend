import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { StepDefinition } from 'codecrafters-frontend/components/step-list';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

class BaseStep {
  isComplete: boolean;
  repository: RepositoryModel;

  constructor(repository: RepositoryModel, isComplete: boolean) {
    this.isComplete = isComplete;
    this.repository = repository;
  }
}

class CloneRepositoryStepDefinition extends BaseStep implements StepDefinition {
  id = 'clone-repository';

  get titleMarkdown() {
    return 'Clone the repository';
  }
}

class PushEmptyCommitStepDefinition extends BaseStep implements StepDefinition {
  id = 'push-empty-commit';

  get titleMarkdown() {
    return 'Push an empty commit';
  }
}

export default class RepositorySetupCard extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get isComplete() {
    return this.coursePageState.currentStep.status === 'complete';
  }

  get steps() {
    return [
      new CloneRepositoryStepDefinition(this.args.repository, this.isComplete),
      new PushEmptyCommitStepDefinition(this.args.repository, this.isComplete),
    ];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard': typeof RepositorySetupCard;
  }
}
