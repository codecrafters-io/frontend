import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CommunitySolutionsTabComponent extends Component {
  @tracked isLoading = true;
  @tracked solutions = [];
  @service store;

  constructor() {
    super(...arguments);

    this.loadSolutions();
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
  async loadSolutions() {
    this.isLoading = true;

    this.solutions = await this.store.query('community-course-stage-solution', {
      course_stage_id: this.args.courseStage.id,
      language_id: this.args.requestedSolutionLanguage.id,
      include: 'user,language',
    });

    this.isLoading = false;
  }

  get shouldShowBlurredOverlay() {
    // If we don't have solutions, don't make it look like we do
    if (!this.communitySolutionsAreAvailableForCurrentLanguage) {
      return false;
    }

    // Only show if viewing for the current repository's language
    if (this.args.requestedSolutionLanguage !== this.args.repository.language) {
      return false;
    }

    // If we have solutions and the user hasn't completed the stage, show the overlay
    return !this.hasCompletedStage;
  }

  get suggestedActionsForBlurredOverlay() {
    const actions = [];

    if (this.communitySolutionsAreAvailableForOtherLanguages) {
      actions.push(['view_community_solutions_in_other_languages']);
    }

    if (this.args.courseStage.hasApprovedComments) {
      actions.push(['view_comments']);
    }

    return actions;
  }

  get sortedSolutions() {
    return this.solutions.sortBy('submittedAt').reverse();
  }
}
