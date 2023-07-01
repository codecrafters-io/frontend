import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

export default class CoursePageContentComponent extends Component {
  @tracked currentCourseStageForSolutionModal;
  @tracked courseStageSolutionModalIntent;
  @tracked isConfiguringGithubIntegration = false;
  @tracked isViewingProgressBanner = false;
  @service authenticator;
  @service router;

  constructor() {
    super(...arguments);

    if (this.args.hasRecentlyCompletedGitHubIntegrationSetup) {
      this.isConfiguringGithubIntegration = true;

      next(() => {
        this.router.transitionTo({ queryParams: { action: null } }); // reset param
      });
    }
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  async handleModalClose() {
    this.currentCourseStageForSolutionModal = null;
    this.courseStageSolutionModalIntent = null;
    this.isConfiguringGithubIntegration = false;
    this.isViewingProgressBanner = false;
  }

  @action
  async handleViewProgressBannerButtonClick() {
    this.isViewingProgressBanner = true;
  }

  @action
  async handleViewCommentsButtonClick(courseStage) {
    await this.handleModalClose();

    this.courseStageSolutionModalIntent = 'view_comments';
    this.currentCourseStageForSolutionModal = courseStage;
  }

  @action
  async handleViewScreencastsButtonClick(courseStage) {
    await this.handleModalClose();

    this.courseStageSolutionModalIntent = 'view_screencasts';
    this.currentCourseStageForSolutionModal = courseStage;
  }

  @action
  async handleViewSolutionButtonClick(courseStage) {
    await this.handleModalClose();

    this.courseStageSolutionModalIntent = 'view_solution';
    this.currentCourseStageForSolutionModal = courseStage;
  }

  @action
  async handlePublishToGithubButtonClick() {
    await this.handleModalClose(); // Ensure other modals are closed.

    this.isConfiguringGithubIntegration = true;
  }

  get visiblePrivateLeaderboardFeatureSuggestion() {
    if (this.authenticator.isAnonymous || (this.currentUser && this.currentUser.isTeamMember)) {
      return null;
    }

    return this.currentUser.featureSuggestions.filterBy('featureIsPrivateLeaderboard').rejectBy('isDismissed').firstObject;
  }
}
