import Component from '@glimmer/component';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    solutions: CommunityCourseStageSolutionModel[];
    repository: string;
  };
};

export default class CommunitySolutionsListComponent extends Component<Signature> {
  rippleSpinnerImage = rippleSpinnerImage;

  @service declare authenticator: AuthenticatorService;
  @service declare coursePageState: CoursePageStateService;

  @tracked configureGithubIntegrationModalIsOpen = false;
  @tracked stageIncompleteModalWasDismissed = false;

  @action
  handleSolutionExpand(solution: CommunityCourseStageSolutionModel, solutionIndex: number) {
    if (this.authenticator.isAuthenticated) {
      solution.createView({ position_in_list: solutionIndex + 1 });
    }
  }

  @action
  handleStageIncompleteModalDismissed() {
    this.stageIncompleteModalWasDismissed = true;
  }

  get shouldShowStageIncompleteModal() {
    console.log(this.coursePageState.currentStep.globalPosition);
    return !this.stageIncompleteModalWasDismissed && this.coursePageState.currentStep.globalPosition > 4 && this.args.solutions.length > 0;
  }
}
