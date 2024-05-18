import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { service } from '@ember/service';
import type CommunityCourseStageSolutionModel from 'codecrafters-frontend/models/community-course-stage-solution';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

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

  @tracked configureGithubIntegrationModalIsOpen = false;

  @action
  handleSolutionExpand(solution: CommunityCourseStageSolutionModel, solutionIndex: number) {
    if (this.authenticator.isAuthenticated) {
      solution.createView({ position_in_list: solutionIndex + 1 });
    }
  }
}
