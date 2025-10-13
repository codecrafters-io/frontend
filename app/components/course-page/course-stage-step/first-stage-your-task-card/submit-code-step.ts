import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseStage: CourseStageModel;
    filename: string | undefined;
    isComplete: boolean;
  };
}

export default class SubmitCodeStep extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare featureFlags: FeatureFlagsService;

  @tracked isCommitModalOpen: boolean = false;
  @tracked isPushModalOpen: boolean = false;

  get currentCourse() {
    return this.args.courseStage.course;
  }

  @action
  handleCommitModalClose() {
    this.isCommitModalOpen = false;
  }

  @action
  handlePushModalClose() {
    this.isPushModalOpen = false;
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageYourTaskCard::SubmitCodeStep': typeof SubmitCodeStep;
  }
}
