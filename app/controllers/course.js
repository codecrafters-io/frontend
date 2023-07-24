import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
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
  @service analyticsEventTracker;

  // query params
  @tracked action;
  @tracked repo; // repository id
  @tracked track;

  @tracked polledRepository;
  @tracked configureGithubIntegrationModalIsOpen = false;
  @tracked isViewingProgressBanner = false; // TODO: Still needed?
  @tracked sidebarIsExpandedOnDesktop = true;
  @tracked sidebarIsExpandedOnMobile = false;
  @tracked leaderboardIsExpanded = true;

  get currentUser() {
    return this.authenticator.currentUser;
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
    this.setupRouteChangeListeners();
    this.startRepositoryPoller();

    if (this.action === 'github_app_installation_completed') {
      this.configureGithubIntegrationModalIsOpen = true;

      next(() => {
        this.router.transitionTo({ queryParams: { action: null } }); // reset param
      });
    }
  }

  @action
  handleDidUpdateActiveRepository() {
    if (this.model.activeRepository !== this.polledRepository) {
      this.stopRepositoryPoller();
      this.startRepositoryPoller();
    }
  }

  @action
  async handlePoll() {
    // Nothing to do at the moment
  }

  @action
  async handleWillDestroyContainer() {
    this.teardownRouteChangeListeners();
    this.stopRepositoryPoller();
  }

  @action
  async handleRouteChanged() {
    this.sidebarIsExpandedOnMobile = false;
  }

  @action
  setupRouteChangeListeners() {
    this.router.on('routeDidChange', this.handleRouteChanged);
  }

  @action
  teardownRouteChangeListeners() {
    this.router.off('routeDidChange', this.handleRouteChanged);
  }

  @action
  handleExpandSidebarButtonClick() {
    this.sidebarIsExpandedOnDesktop = !this.sidebarIsExpandedOnDesktop;

    this.analyticsEventTracker.track('expanded_course_page_sidebar', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleCollapseSidebarButtonClick() {
    this.sidebarIsExpandedOnDesktop = !this.sidebarIsExpandedOnDesktop;

    this.analyticsEventTracker.track('collapsed_course_page_sidebar', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleExpandLeaderboardButtonClick() {
    this.leaderboardIsExpanded = !this.leaderboardIsExpanded;

    this.analyticsEventTracker.track('expanded_course_page_leaderboard', {
      course_id: this.model.course.id,
    });
  }

  @action
  handleCollapseLeaderboardButtonClick() {
    this.leaderboardIsExpanded = !this.leaderboardIsExpanded;

    this.analyticsEventTracker.track('collapsed_course_page_leaderboard', {
      course_id: this.model.course.id,
    });
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
