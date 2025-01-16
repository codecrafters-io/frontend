import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isComplete: boolean;
  };
}

export default class SubmitCodeStepComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare featureFlags: FeatureFlagsService;

  @tracked isCommitModalOpen = false;
  @tracked isPushModalOpen = false;

  get canSeeSplitUpGitCommandsForStage1() {
    return true;
    // return this.featureFlags.canSeeSplitUpGitCommandsForStage1;
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageTutorialCard::SubmitCodeStep': typeof SubmitCodeStepComponent;
  }
}
