import Component from '@glimmer/component';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CourseStageSolutionModel from 'codecrafters-frontend/models/course-stage-solution';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { StepDefinition } from 'codecrafters-frontend/components/step-list';
import { action } from '@ember/object';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
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

class ImplementSolutionStep extends BaseStep implements StepDefinition {
  id = 'implement-solution';

  get titleMarkdown() {
    return 'Write code to pass this stage';
  }
}

class RunTestsStep extends BaseStep implements StepDefinition {
  id = 'run-tests';

  get titleMarkdown() {
    return 'Run tests remotely';
  }
}

export default class HowToPassStepList extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get implementSolutionStepIsComplete() {
    return (
      this.runTestsStepIsComplete ||
      (this.args.repository.lastSubmission?.courseStage === this.args.courseStage && !this.args.repository.lastSubmission?.clientTypeIsSystem)
    );
  }

  get runTestsStepIsComplete() {
    return (
      this.args.repository.stageIsComplete(this.args.courseStage) ||
      (this.args.repository.lastSubmissionHasSuccessStatus &&
        this.args.repository.lastSubmission.courseStage === this.args.courseStage &&
        !this.args.repository.lastSubmission?.clientTypeIsSystem)
    );
  }

  get solution(): CourseStageSolutionModel | null {
    return this.args.courseStage.solutions.find((s) => s.language === this.args.repository.language) || null;
  }

  get steps() {
    return [
      new ImplementSolutionStep(this.args.repository, this.implementSolutionStepIsComplete),
      new RunTestsStep(this.args.repository, this.runTestsStepIsComplete),
    ];
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard::HowToPassStepList': typeof HowToPassStepList;
  }
}
