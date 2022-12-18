import { clickable, clickOnText, collection, create, visitable } from 'ember-cli-page-object';
import CollapsedItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/collapsed-item';
import CourseCompletedItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/course-completed-item';
import CourseStageItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/course-stage-item';
import CourseStageSolutionModal from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-solution-modal';
import Header from 'codecrafters-frontend/tests/pages/components/header';
import Leaderboard from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard';
import PrivateLeaderboardFeatureSuggestion from 'codecrafters-frontend/tests/pages/components/private-leaderboard-feature-suggestion';
import RepositoryDropdown from 'codecrafters-frontend/tests/pages/components/course-page/repository-dropdown';
import SetupItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/setup-item';

export default create({
  activeCourseStageItem: CourseStageItem,
  clickOnCollapsedItem: clickOnText('[data-test-collapsed-item]'),
  collapsedItems: collection('[data-test-collapsed-item]', CollapsedItem),
  courseCompletedItem: CourseCompletedItem,

  get courseCompletedItemIsActive() {
    return this.courseCompletedItem.isVisible;
  },

  get courseStageItemIsActive() {
    return this.activeCourseStageItem.isVisible;
  },

  configureGithubIntegrationModal: {
    get isOpen() {
      return this.isVisible;
    },

    clickOnPublishButton: clickable('[data-test-publish-button]'),
    clickOnDisconnectRepositoryButton: clickable('[data-test-disconnect-repository-button]'),

    scope: '[data-test-configure-github-integration-modal]',
  },

  courseStageSolutionModal: CourseStageSolutionModal,
  header: Header,
  leaderboard: Leaderboard,
  repositoryDropdown: RepositoryDropdown,
  privateLeaderboardFeatureSuggestion: PrivateLeaderboardFeatureSuggestion,

  progressBannerModal: {
    scope: '[data-test-progress-banner-modal]',
  },

  setupItem: SetupItem,

  get setupItemIsActive() {
    return this.setupItem.isVisible;
  },

  visit: visitable('/courses/:course_slug'),
});
