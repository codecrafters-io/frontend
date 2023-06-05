import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class CommunitySolutionsTabComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;
  @tracked isLoading = true;
  @tracked isLoadingNextBatch = false; // We don't "actually paginate" yet, we only do this because rendering solutions is expensive.
  @tracked solutions = [];
  @tracked revealSolutionOverlayWasDisabledByUser = false;
  @service store;
  @tracked lastVisibleSolutionIndex = 2;

  constructor() {
    super(...arguments);

    this.loadSolutions();
  }

  get communitySolutionsAreAvailableForCurrentLanguage() {
    return this.args.courseStage.hasCommunitySolutionsForLanguage(this.args.requestedSolutionLanguage);
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
      100
    );
  }

  @action
  async handleRevealSolutionsButtonClick() {
    this.revealSolutionOverlayWasDisabledByUser = true;
  }

  get hasCompletedStage() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  get hasNextResults() {
    return this.lastVisibleSolutionIndex < this.solutions.length - 1;
  }

  @action
  async loadSolutions() {
    this.isLoading = true;

    this.solutions = await this.store.query('community-course-stage-solution', {
      course_stage_id: this.args.courseStage.id,
      language_id: this.args.requestedSolutionLanguage.id,
      include: 'user,language,comments,comments.user,comments.target',
    });

    this.isLoading = false;
  }

  get shouldShowRevealSolutionOverlay() {
    // For the first stage, let users view anyway
    if (this.args.courseStage.isFirst) {
      return false;
    }

    // If we don't have solutions, don't make it look like we do
    if (!this.communitySolutionsAreAvailableForCurrentLanguage) {
      return false;
    }

    // Only show if viewing for the current repository's language
    if (this.args.requestedSolutionLanguage !== this.args.repository.language) {
      return false;
    }

    // If we have solutions and the user hasn't completed the stage, show the overlay
    return !this.hasCompletedStage && !this.revealSolutionOverlayWasDisabledByUser;
  }

  get sortedSolutions() {
    return this.solutions; // For now, the API handles sorting
  }

  get visibleSolutions() {
    return this.sortedSolutions.slice(0, this.lastVisibleSolutionIndex);
  }
}
