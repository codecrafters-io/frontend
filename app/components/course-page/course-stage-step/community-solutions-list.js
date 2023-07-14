import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

export default class CommunitySolutionsListComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;
  @tracked isLoadingNextBatch = false; // We don't "actually paginate" yet, we only do this because rendering solutions is expensive.
  @tracked lastVisibleSolutionIndex = 2;
  @tracked configureGithubIntegrationModalIsOpen = false;

  @action
  async handleListEndReached() {
    this.isLoadingNextBatch = true;

    later(
      this,
      () => {
        this.isLoadingNextBatch = false;
        this.lastVisibleSolutionIndex += 2;
      },
      100
    );
  }

  get hasNextResults() {
    return this.lastVisibleSolutionIndex < this.args.solutions.length - 1;
  }

  get visibleSolutions() {
    return this.args.solutions.slice(0, this.lastVisibleSolutionIndex + 1);
  }
}
