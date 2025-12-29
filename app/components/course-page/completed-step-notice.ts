import Component from '@glimmer/component';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    step: StepDefinition;
  };
}

export default class CompletedStepNotice extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;

  @tracked shareProgressModalIsOpen = false;

  get activeStep() {
    return this.coursePageState.activeStep;
  }

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get currentStepAsCourseStageStep() {
    return this.coursePageState.currentStepAsCourseStageStep;
  }

  get instructionsMarkdown() {
    return this.args.step.completionNoticeMessage!;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }

  get shouldShowShareProgressButton() {
    return this.currentStep?.type === 'CourseStageStep' && !this.currentStepAsCourseStageStep?.stageListItem?.stage?.isFirst;
  }

  get stepForNextOrActiveStepButton() {
    if (!this.nextStep) {
      return this.activeStep;
    }

    // Special-case completion "milestones" so the call-to-action takes users to the celebration screen,
    // even if the active step ends up being something else (e.g. extension-completed steps).
    if (this.nextStep.type === 'BaseStagesCompletedStep' || this.nextStep.type === 'CourseCompletedStep') {
      return this.nextStep;
    }

    return this.activeStep;
  }

  @action
  handleShareProgressButtonClick() {
    this.analyticsEventTracker.track('initiated_share_progress_flow', {
      repository_id: this.args.repository.id,
    });

    this.shareProgressModalIsOpen = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CompletedStepNotice': typeof CompletedStepNotice;
  }
}
