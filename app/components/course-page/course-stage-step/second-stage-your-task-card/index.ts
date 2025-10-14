import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import type { StepDefinition } from 'codecrafters-frontend/components/expandable-step-list';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
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
  canBeCompletedManually = true;

  get titleMarkdown() {
    return 'Implement solution';
  }
}

class RunTestsStep extends BaseStep implements StepDefinition {
  id = 'run-tests';
  canBeCompletedManually = false;

  get titleMarkdown() {
    return 'Run tests';
  }
}

export default class SecondStageYourTaskCard extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  get implementSolutionStepIsComplete() {
    return (
      this.implementSolutionStepWasMarkedAsComplete ||
      this.runTestsStepIsComplete ||
      (this.args.currentStep.repository.lastSubmission?.courseStage === this.args.currentStep.courseStage &&
        !this.args.currentStep.repository.lastSubmission?.clientTypeIsSystem) // Run tests (in progress)
    );
  }

  get implementSolutionStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInSecondStageInstructions.includes('implement-solution');
  }

  get instructionsMarkdown() {
    return this.args.currentStep.courseStage.buildInstructionsMarkdownFor(this.args.currentStep.repository);
  }

  get runTestsStepIsComplete() {
    return (
      this.args.currentStep.repository.stageIsComplete(this.args.currentStep.courseStage) ||
      (this.args.currentStep.repository.lastSubmissionHasSuccessStatus &&
        this.args.currentStep.repository.lastSubmission.courseStage === this.args.currentStep.courseStage &&
        !this.args.currentStep.repository.lastSubmission?.clientTypeIsSystem)
    );
  }

  get steps() {
    return [
      new ImplementSolutionStep(this.args.currentStep.repository, this.implementSolutionStepIsComplete),
      new RunTestsStep(this.args.currentStep.repository, this.runTestsStepIsComplete),
    ];
  }

  @action
  handleStepCompletedManually(step: StepDefinition) {
    if (step.id === 'implement-solution') {
      this.coursePageState.recordManuallyCompletedStepInSecondStageInstructions('implement-solution');

      this.analyticsEventTracker.track('completed_second_stage_tutorial_step', {
        step_number: 2,
        step_id: 'implement-solution',
        repository_id: this.args.currentStep.repository.id,
      });
    }
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageYourTaskCard': typeof SecondStageYourTaskCard;
  }
}
