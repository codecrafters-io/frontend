import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import Store from '@ember-data/store';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { Step } from 'codecrafters-frontend/components/expandable-step-list';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    currentStep: CourseStageStep;
    shouldHideTestRunnerCardRelatedCopy: boolean;
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

class NavigateToFileStep extends BaseStep implements Step {
  id = 'navigate-to-file';
  canBeCompletedManually = true;

  get titleMarkdown() {
    if (!this.repository.firstStageSolution) {
      return 'Navigate to README.md';
    }

    const filename = this.repository.firstStageSolution.changedFiles[0]!.filename;

    if (filename) {
      return `Navigate to ${filename}`;
    } else {
      return 'Navigate to file';
    }
  }
}

class UncommentCodeStep extends BaseStep implements Step {
  id = 'uncomment-code';
  canBeCompletedManually = true;

  get titleMarkdown() {
    return 'Uncomment code';
  }
}

class SubmitCodeStep extends BaseStep implements Step {
  id = 'submit-code';
  canBeCompletedManually = false;

  get titleMarkdown() {
    return 'Submit changes';
  }
}

export default class FirstStageTutorialCardComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare store: Store;

  get currentCourse() {
    return this.args.courseStage.course;
  }

  get navigateToFileStepIsComplete() {
    return this.navigateToFileStepWasMarkedAsComplete || this.uncommentCodeStepIsComplete;
  }

  get navigateToFileStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInFirstStageInstructions.includes('navigate-to-file');
  }

  get shouldShowLinkToForum() {
    const currentStep = this.args.currentStep;

    return currentStep.testsStatus !== 'passed' && currentStep.status !== 'complete';
  }

  get steps() {
    return [
      new NavigateToFileStep(this.args.repository, this.navigateToFileStepIsComplete),
      new UncommentCodeStep(this.args.repository, this.uncommentCodeStepIsComplete),
      new SubmitCodeStep(this.args.repository, this.submitCodeStepIsComplete),
    ];
  }

  get submitCodeStepIsComplete() {
    return this.args.repository.lastSubmissionHasSuccessStatus || this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get uncommentCodeStepIsComplete() {
    return this.uncommentCodeStepWasMarkedAsComplete || this.submitCodeStepIsComplete;
  }

  get uncommentCodeStepWasMarkedAsComplete() {
    return this.coursePageState.manuallyCompletedStepIdsInFirstStageInstructions.includes('uncomment-code');
  }

  @action
  handleStepCompletedManually(step: Step) {
    if (step.id === 'navigate-to-file') {
      this.coursePageState.recordManuallyCompletedStepInFirstStageInstructions('navigate-to-file');

      this.analyticsEventTracker.track('completed_first_stage_tutorial_step', {
        step_number: 1,
        step_id: 'navigate-to-file',
        repository_id: this.args.repository.id,
      });
    }

    if (step.id === 'uncomment-code') {
      this.coursePageState.recordManuallyCompletedStepInFirstStageInstructions('uncomment-code');
      this.coursePageState.recordManuallyCompletedStepInFirstStageInstructions('navigate-to-file');

      this.analyticsEventTracker.track('completed_first_stage_tutorial_step', {
        step_number: 2,
        step_id: 'uncomment-code',
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
    'CoursePage::CourseStageStep::FirstStageTutorialCard': typeof FirstStageTutorialCardComponent;
  }
}
