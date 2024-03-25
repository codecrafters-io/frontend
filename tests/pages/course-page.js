import CommentCard from 'codecrafters-frontend/tests/pages/components/comment-card';
import CommentList from 'codecrafters-frontend/tests/pages/components/course-page/comment-list';
import ConfigureExtensionsModal from 'codecrafters-frontend/tests/pages/components/course-page/configure-extensions-modal';
import CreateRepositoryCard from 'codecrafters-frontend/tests/pages/components/course-page/create-repository-card';
import DesktopHeader from 'codecrafters-frontend/tests/pages/components/course-page/desktop-header';
import LanguageDropdown from './components/language-dropdown';
import Leaderboard from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard';
import PrivateLeaderboardFeatureSuggestion from 'codecrafters-frontend/tests/pages/components/private-leaderboard-feature-suggestion';
import RepositoryDropdown from 'codecrafters-frontend/tests/pages/components/course-page/repository-dropdown';
import RepositorySetupCard from 'codecrafters-frontend/tests/pages/components/course-page/repository-setup-card';
import Sidebar from 'codecrafters-frontend/tests/pages/components/course-page/sidebar';
import TestResultsBar from 'codecrafters-frontend/tests/pages/components/course-page/test-results-bar';
import YourTaskCard from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-step/your-task-card';
import { collection, clickable, create, fillable, isVisible, text, triggerable, visitable } from 'ember-cli-page-object';

export default create({
  adminButton: {
    scope: '[data-test-course-admin-button]',
  },

  betaLabelText: text('[data-test-course-beta-label]'),
  clickOnCollapseLeaderboardButton: clickable('[data-test-collapse-leaderboard-button]'),
  clickOnCollapseSidebarButton: clickable('[data-test-collapse-sidebar-button]'),
  clickOnExpandLeaderboardButton: clickable('[data-test-expand-leaderboard-button]'),
  clickOnExpandSidebarButton: clickable('[data-test-expand-sidebar-button]'),

  completedStepNotice: {
    clickOnNextStepButton: clickable('[data-test-next-step-button]'),
    scope: '[data-test-completed-step-notice]',

    shareProgressButton: {
      scope: '[data-test-share-progress-button]',
    },
  },

  courseCompletedCard: {
    clickOnPublishToGithubLink: clickable('span:contains("Click here")'),
    instructionsText: text('[data-test-instructions-text]'),
    scope: '[data-test-course-completed-card]',
  },

  codeExamplesTab: {
    languageDropdown: LanguageDropdown,

    solutionCards: collection('[data-test-community-solution-card]', {
      clickOnCollapseButton: async function () {
        await this.collapseButtons.at(0).click();
      },

      clickOnExpandButton: clickable('[data-test-expand-button]'),
      collapseButtons: collection('[data-test-collapse-button]'),
      toggleCommentsButtons: collection('[data-test-toggle-comments-button]'),
      commentCards: collection('[data-test-comment-card]', CommentCard),
    }),

    scope: '[data-test-code-examples-tab]',
  },

  commentList: CommentList,
  configureExtensionsModal: ConfigureExtensionsModal,

  configureGithubIntegrationModal: {
    get isOpen() {
      return this.isVisible;
    },

    clickOnPublishButton: clickable('[data-test-publish-button]'),
    clickOnDisconnectRepositoryButton: clickable('[data-test-disconnect-repository-button]'),

    fixGitHubAppInstallationPrompt: {
      refreshStatusButton: { scope: '[data-test-refresh-status-button]' },
      scope: '[data-test-fix-github-app-installation-prompt]',
    },

    scope: '[data-test-configure-github-integration-modal]',
  },

  createRepositoryCard: CreateRepositoryCard,

  deleteRepositoryModal: {
    get isOpen() {
      return this.isVisible;
    },

    deleteRepositoryButton: {
      hover: triggerable('mouseenter'),
      leave: triggerable('mouseleave'),
      press: triggerable('mousedown'),

      progressIndicator: {
        scope: '[data-test-progress-indicator]',
      },

      release: triggerable('mouseup'),
      scope: '[data-test-delete-repository-button]',
    },

    deleteRepositorySubmissionsCountCopy: text('[data-test-delete-repository-submissions-count-copy]'),

    scope: '[data-test-delete-repository-modal]',
  },

  desktopHeader: DesktopHeader,

  earnedBadgeNotice: {
    badgeEarnedModal: {
      badgeName: text('[data-test-badge-name]'),
      resetScope: true,
      scope: '[data-test-badge-earned-modal]',
    },

    scope: '[data-test-earned-badge-notice]',
  },

  freeCourseLabel: {
    hover: triggerable('mouseenter'),
    scope: '[data-test-course-free-label]',
  },

  hasExpandedLeaderboard: isVisible('[data-test-collapse-leaderboard-button]'),
  hasExpandedSidebar: isVisible('[data-test-collapse-sidebar-button]'),

  installCliLink: {
    scope: '[data-test-install-cli-link]',
  },

  languageGuideCard: {
    backToRepositoryLanguageButton: {
      scope: '[data-test-back-to-repository-language-button]',
    },

    clickOnExpandButton: clickable('[data-test-expand-button]'),
    clickOnCollapseButton: clickable('[data-test-collapse-button]'),

    feedbackDropdown: {
      clickOnSendButton: clickable('[data-test-send-button]'),
      fillInExplanation: fillable('textarea'),
      isOpen: isVisible('[data-test-feedback-dropdown-content]', { resetScope: true }),
      resetScope: true,
      sendButtonIsVisible: isVisible('[data-test-send-button]'),
      scope: '[data-test-feedback-dropdown-content]',
      toggle: clickable('[data-test-feedback-button]', { resetScope: true }),
    },

    languageDropdown: LanguageDropdown,
    scope: '[data-test-language-guide-card]',
  },

  leaderboard: Leaderboard,

  monthlyChallengeBanner: {
    scope: '[data-test-monthly-challenge-banner]',
  },

  repositoryDropdown: RepositoryDropdown,
  privateLeaderboardFeatureSuggestion: PrivateLeaderboardFeatureSuggestion,

  progressBannerModal: {
    scope: '[data-test-progress-banner-modal]',
  },

  secondStageInstructionsCard: {
    hasScreencastsLink: isVisible('[data-test-screencasts-link]'),
  },

  shareProgressModal: {
    clickOnCopyButton: clickable('[data-test-copy-button]'),

    copyableText: {
      scope: '[data-test-copyable-text]',
    },

    scope: '[data-test-share-progress-modal]',
    socialPlatformIcons: collection('[data-test-social-platform-icon]'),
  },

  repositorySetupCard: RepositorySetupCard,
  sidebar: Sidebar,
  testResultsBar: TestResultsBar,

  upgradePrompt: {
    scope: '[data-test-upgrade-prompt]',
    secondaryCopy: text('[data-test-upgrade-prompt-secondary-copy]'),
  },

  visit: visitable('/courses/:course_slug'),
  yourTaskCard: YourTaskCard,
});
