import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import type { StepDefinition } from 'codecrafters-frontend/components/expandable-step-list';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
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

class UncommentCodeStep extends BaseStep implements StepDefinition {
  id = 'uncomment-code';
  canBeCompletedManually = true;

  get titleMarkdown() {
    const filename = this.repository.firstStageSolution?.changedFiles[0]?.filename;

    if (filename) {
      return `Uncomment code in ${filename}`;
    } else {
      return 'Uncomment code';
    }
  }
}

class SubmitCodeStep extends BaseStep implements StepDefinition {
  id = 'submit-code';
  canBeCompletedManually = false;

  get titleMarkdown() {
    return 'Git push to submit your changes';
  }
}

export default class FirstStageYourTaskCard extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  get filename() {
    const solution = this.args.currentStep.courseStage.solutions.find((solution) => solution.language === this.args.currentStep.repository.language);

    return solution?.changedFiles[0]?.filename;
  }

  get hasPassedTests() {
    return this.args.currentStep.testsStatus === 'passed' || this.args.currentStep.status === 'complete';
  }

  get instructionsMarkdown() {
    return this.args.currentStep.courseStage.buildInstructionsMarkdownFor(this.args.currentStep.repository);
  }

  get steps() {
    return [
      new UncommentCodeStep(this.args.currentStep.repository, this.uncommentCodeStepIsComplete),
      new SubmitCodeStep(this.args.currentStep.repository, this.submitCodeStepIsComplete),
    ];
  }

  get submitCodeStepIsComplete() {
    return (
      this.args.currentStep.repository.lastSubmissionHasSuccessStatus ||
      this.args.currentStep.repository.stageIsComplete(this.args.currentStep.courseStage)
    );
  }

  get truncatedInstructionsMarkdown(): string {
    return this.instructionsMarkdown.split('\n\n')[0]!;
  }

  get uncommentCodeStepIsComplete() {
    return this.uncommentCodeStepWasMarkedAsComplete || this.submitCodeStepIsComplete;
  }

  get uncommentCodeStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInFirstStageInstructions.includes('uncomment-code');
  }

  @action
  handleStepCompletedManually(step: StepDefinition) {
    if (step.id === 'uncomment-code') {
      this.coursePageState.recordManuallyCompletedStepInFirstStageInstructions('uncomment-code');

      this.analyticsEventTracker.track('completed_first_stage_tutorial_step', {
        step_number: 1,
        step_id: 'uncomment-code',
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
    'CoursePage::CourseStageStep::FirstStageYourTaskCard': typeof FirstStageYourTaskCard;
  }
}
