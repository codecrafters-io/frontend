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

  @tracked isLoadingNextBatch = false; // We don't "actually paginate" yet, we only do this because rendering solutions is expensive.
  @tracked lastVisibleSolutionIndex = 2;
  @tracked configureGithubIntegrationModalIsOpen = false;

  get hasNextResults() {
    return this.lastVisibleSolutionIndex < this.args.solutions.length - 1;
  }

  get visibleSolutions() {
    return this.args.solutions.slice(0, this.lastVisibleSolutionIndex + 1);
  }

  @action
  async handleListEndReached() {
    this.isLoadingNextBatch = true;

    later(
      this,
      () => {
        this.isLoadingNextBatch = false;
        this.lastVisibleSolutionIndex += 2;
      },
      100,
    );
  }

  @action
  handleSolutionExpand(solution: CommunityCourseStageSolutionModel, solutionIndex: number) {
    if (this.authenticator.isAuthenticated) {
      solution.createView({ position_in_list: solutionIndex + 1 });
    }
  }
}
