import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CommunitySolutionsTabComponent extends Component {
  @tracked isLoading = true;
  @tracked solutions = [];
  @tracked blurredOverlayWasDisabledByUser = false;
  @service store;

  constructor() {
    super(...arguments);

    this.loadSolutions();
  }

  get blurredOverlayInstructionsText() {
    if (this.suggestedActionsForBlurredOverlay.length === 0) {
      return `Looks like you haven't completed this stage yet. Sure you want to see the solution?`;
    } else if (
      this.suggestedActionsForBlurredOverlay.includes('view_community_solutions_in_other_languages') &&
      this.suggestedActionsForBlurredOverlay.includes('view_comments')
    ) {
      return `Looks like you haven't  completed this stage yet in ${this.args.repository.language.name} yet. Maybe peek at the comments for hints, or check out other language solutions?`;
    } else if (this.suggestedActionsForBlurredOverlay.includes('view_community_solutions_in_other_languages')) {
      return `Looks like you haven't completed this stage yet in ${this.args.repository.language.name} yet. Maybe peek at solutions in other languages first?`;
    } else if (this.suggestedActionsForBlurredOverlay.includes('view_comments')) {
      return `Looks like you haven't completed this stage yet. Maybe peek at the comments first, in case there are hints?`;
    } else {
      throw `Unexpected suggested actions for blurred overlay`;
    }
  }

  get communitySolutionsAreAvailableForCurrentLanguage() {
    return this.args.courseStage.hasCommunitySolutionsForLanguage(this.args.requestedSolutionLanguage);
  }

  get communitySolutionsAreAvailableForOtherLanguages() {
    return this.args.courseStage.hasCommunitySolutionsForLanguagesOtherThan(this.args.requestedSolutionLanguage);
  }

  get hasCompletedStage() {
    return this.args.repository.stageIsComplete(this.args.courseStage);
  }

  @action
  async handleRevealSolutionsButtonClick() {
    this.blurredOverlayWasDisabledByUser = true;
  }

  @action
  async loadSolutions() {
    this.isLoading = true;

    this.solutions = await this.store.query('community-course-stage-solution', {
      course_stage_id: this.args.courseStage.id,
      language_id: this.args.requestedSolutionLanguage.id,
      include: 'user,language',
    });

    this.isLoading = false;
  }

  get textForViewCommunitySolutionsInOtherLanguagesButton() {
    if (
      this.suggestedActionsForBlurredOverlay.length === 1 &&
      this.suggestedActionsForBlurredOverlay.includes('view_community_solutions_in_other_languages')
    ) {
      return `Good idea`;
    } else {
      return 'Another language';
    }
  }

  get textForRevealSolutionsButton() {
    if (this.suggestedActionsForBlurredOverlay.includes('view_community_solutions_in_other_languages')) {
      return `Reveal ${this.args.repository.language.name} solutions`;
    } else {
      return 'Reveal solutions';
    }
  }

  get shouldShowBlurredOverlay() {
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
    return !this.hasCompletedStage && !this.blurredOverlayWasDisabledByUser;
  }

  get suggestedActionsForBlurredOverlay() {
    const actions = [];

    if (this.communitySolutionsAreAvailableForOtherLanguages) {
      actions.push('view_community_solutions_in_other_languages');
    }

    if (this.args.courseStage.hasApprovedComments) {
      actions.push('view_comments');
    }

    return actions;
  }

  get sortedSolutions() {
    return this.solutions.sortBy('submittedAt').reverse();
  }
}
