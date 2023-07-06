import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import config from 'codecrafters-frontend/config/environment';

export default class CourseController extends Controller {
  queryParams = ['action', 'track', 'repo'];

  @service authenticator;
  @service coursePageState;
  @service store;
  @service router;
  @service visibility;

  // query params
  @tracked action;
  @tracked repo; // repository id
  @tracked track;

  @tracked polledRepository;

  // Legacy: remove these
  @tracked courseStageSolutionModalIntent;
  @tracked currentCourseStageForSolutionModal;
  @tracked isConfiguringGithubIntegration = false;
  @tracked isViewingProgressBanner = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get hasRecentlyCompletedGitHubIntegrationSetup() {
    return this.action === 'github_app_installation_completed';
  }

  get isDevelopmentOrTest() {
    return config.environment !== 'production';
  }

  get selectedRepositoryId() {
    return this.repo;
  }

  get visiblePrivateLeaderboardFeatureSuggestion() {
    if (this.authenticator.isAnonymous || (this.currentUser && this.currentUser.isTeamMember)) {
      return null;
    }

    return this.currentUser.featureSuggestions.filterBy('featureIsPrivateLeaderboard').rejectBy('isDismissed').firstObject;
  }

  @action
  handleDidInsertContainer() {
    this.startRepositoryPoller();

    // TODO: How do we fetch the "hasRecentlyCompletedGitHubIntegrationSetup" query param?
    // if (this.args.hasRecentlyCompletedGitHubIntegrationSetup) {
    //   this.isConfiguringGithubIntegration = true;

    //   next(() => {
    //     this.router.transitionTo({ queryParams: { action: null } }); // reset param
    //   });
    // }
  }

  @action
  handleDidUpdateActiveRepository() {
    if (this.model.activeRepository !== this.polledRepository) {
      this.stopRepositoryPoller();
      this.startRepositoryPoller();
    }
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
  async handlePoll() {
    // Nothing to do at the moment
  }

  @action
  async handleWillDestroyContainer() {
    this.stopRepositoryPoller();
  }

  startRepositoryPoller() {
    this.stopRepositoryPoller();

    if (this.model.activeRepository) {
      this.repositoryPoller = new RepositoryPoller({ store: this.store, visibilityService: this.visibility, intervalMilliseconds: 2000 });
      this.repositoryPoller.start(this.model.activeRepository, this.handlePoll);
      this.polledRepository = this.model.activeRepository;
    }
  }

  stopRepositoryPoller() {
    if (this.repositoryPoller) {
      this.repositoryPoller.stop();
    }

    this.polledRepository = null;
  }
}
