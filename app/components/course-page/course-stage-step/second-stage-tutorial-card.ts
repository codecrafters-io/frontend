import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Store from '@ember-data/store';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { action } from '@ember/object';
import type { Step } from 'codecrafters-frontend/components/expandable-step-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    shouldRecommendLanguageGuide: boolean;
    shouldShowSolution: boolean;
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

class ImplementSolutionStep extends BaseStep implements Step {
  id = 'implement-solution';
  canBeCompletedManually = true;

  get titleMarkdown() {
    return 'Implement solution';
  }
}

class RunTestsStep extends BaseStep implements Step {
  id = 'run-tests';
  canBeCompletedManually = false;

  get titleMarkdown() {
    return 'Run tests';
  }
}

export default class SecondStageTutorialCardComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  get implementSolutionStepIsComplete() {
    return (
      this.implementSolutionStepWasMarkedAsComplete ||
      this.runTestsStepIsComplete ||
      (this.args.repository.lastSubmission?.courseStage === this.args.courseStage && !this.args.repository.lastSubmission?.clientTypeIsSystem) // Run tests (in progress)
    );
  }

  get implementSolutionStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInSecondStageInstructions.includes('implement-solution');
  }

  get readInstructionsStepIsComplete() {
    return this.implementSolutionStepIsComplete || this.readInstructionsStepWasMarkedAsComplete;
  }

  get readInstructionsStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInSecondStageInstructions.includes('read-instructions');
  }

  get runTestsStepIsComplete() {
    return (
      this.args.repository.stageIsComplete(this.args.courseStage) ||
      (this.args.repository.lastSubmissionHasSuccessStatus &&
        this.args.repository.lastSubmission.courseStage === this.args.courseStage &&
        !this.args.repository.lastSubmission.clientTypeIsSystem)
    );
  }

  get steps() {
    return [
      new ImplementSolutionStep(this.args.repository, this.implementSolutionStepIsComplete),
      new RunTestsStep(this.args.repository, this.runTestsStepIsComplete),
    ];
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (step.id === 'read-instructions') {
      this.coursePageState.recordManuallyCompletedStepInSecondStageInstructions('read-instructions');

      this.analyticsEventTracker.track('completed_second_stage_tutorial_step', {
        step_number: 1,
        step_id: 'read-instructions',
        repository_id: this.args.repository.id,
      });
    }

    if (step.id === 'implement-solution') {
      this.coursePageState.recordManuallyCompletedStepInSecondStageInstructions('read-instructions');
      this.coursePageState.recordManuallyCompletedStepInSecondStageInstructions('implement-solution');

      this.analyticsEventTracker.track('completed_second_stage_tutorial_step', {
        step_number: 2,
        step_id: 'implement-solution',
        repository_id: this.args.repository.id,
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
    'CoursePage::CourseStageStep::SecondStageTutorialCard': typeof SecondStageTutorialCardComponent;
  }
}
