import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

interface Signature {
  Element: HTMLDivElement;
}

export default class CurrentStepCompletePill extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;

  @tracked isShareProgressModalOpen = false;

  get activeStep() {
    return this.coursePageState.activeStep;
  }

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get currentStepAsCourseStageStep() {
    return this.coursePageState.currentStepAsCourseStageStep;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }

  get repository(): RepositoryModel {
    return this.coursePageState.stepListAsStepListDefinition.repository;
  }

  get shouldShowShareProgressButton() {
    return this.currentStep?.type === 'CourseStageStep' && !this.currentStepAsCourseStageStep?.stageListItem?.stage?.isFirst;
  }

  get targetStep() {
    if (!this.nextStep) {
      return this.activeStep;
    }

    if (this.nextStep.type === 'BaseStagesCompletedStep' || this.nextStep.type === 'CourseCompletedStep') {
      return this.nextStep;
    }

    return this.activeStep;
  }

  get targetStepButtonCopy() {
    if (this.nextStep === this.targetStep) {
      if (this.nextStep?.type === 'CourseStageStep') {
        return 'View next stage';
      }

      return 'View next step';
    }

    return `View current ${this.activeStep.type === 'CourseStageStep' ? 'stage' : 'step'}`;
  }

  @action
  handleShareProgressButtonClick() {
    this.analyticsEventTracker.track('initiated_share_progress_flow', {
      repository_id: this.repository.id,
    });

    this.isShareProgressModalOpen = true;
  }

  @action
  handleShareProgressModalClosed() {
    this.isShareProgressModalOpen = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CurrentStepCompletePill': typeof CurrentStepCompletePill;
  }
}
