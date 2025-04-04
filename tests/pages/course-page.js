import CommentCard from 'codecrafters-frontend/tests/pages/components/comment-card';
import CommentList from 'codecrafters-frontend/tests/pages/components/course-page/comment-list';
import CopyableTerminalCommand from 'codecrafters-frontend/tests/pages/components/copyable-terminal-command';
import ConfigureExtensionsModal from 'codecrafters-frontend/tests/pages/components/course-page/configure-extensions-modal';
import CreateRepositoryCard from 'codecrafters-frontend/tests/pages/components/course-page/create-repository-card';
import Header from 'codecrafters-frontend/tests/pages/components/course-page/header';
import FeedbackPrompt from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-step/feedback-prompt';
import FirstStageTutorialCard from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-step/first-stage-tutorial-card';
import LanguageDropdown from './components/language-dropdown';
import FeedbackDropdown from 'codecrafters-frontend/tests/pages/components/feedback-dropdown';
import Leaderboard from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard';
import PrivateLeaderboardFeatureSuggestion from 'codecrafters-frontend/tests/pages/components/private-leaderboard-feature-suggestion';
import RepositoryDropdown from 'codecrafters-frontend/tests/pages/components/course-page/repository-dropdown';
import RepositorySetupCard from 'codecrafters-frontend/tests/pages/components/course-page/repository-setup-card';
import SecondStageTutorialCard from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-step/second-stage-tutorial-card';
import Sidebar from 'codecrafters-frontend/tests/pages/components/course-page/sidebar';
import TestResultsBar from 'codecrafters-frontend/tests/pages/components/course-page/test-results-bar';
import YourTaskCard from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-step/your-task-card';
import FileContentsCard from 'codecrafters-frontend/tests/pages/components/file-contents-card';
import { clickOnText, clickable, collection, create, hasClass, isVisible, text, triggerable, visitable } from 'ember-cli-page-object';

export default create({
  adminButton: {
    scope: '[data-test-course-admin-button]',
  },

  betaLabelText: text('[data-test-course-beta-label]'),
  clickOnCollapseLeaderboardButton: clickable('[data-test-collapse-leaderboard-button]'),
  clickOnCollapseSidebarButton: clickable('[data-test-collapse-sidebar-button]'),
  clickOnExpandLeaderboardButton: clickable('[data-test-expand-leaderboard-button]'),
  clickOnExpandSidebarButton: clickable('[data-test-expand-sidebar-button]'),
  clickOnHeaderTabLink: clickOnText('[data-test-course-page-header-sticky-section] [data-test-header-tab-link]'),
  clickOnModalBackdrop: clickable('[data-test-modal-backdrop]'),

  completedStepNotice: {
    nextOrActiveStepButton: {
      scope: '[data-test-next-or-active-step-button]',
    },

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
      changedFiles: collection('[data-test-community-solution-changed-file]'),

      unchangedFiles: collection('[data-test-community-solution-unchanged-file]', FileContentsCard),

      clickOnCollapseButton: async function () {
        await this.collapseButtons[0].click();
      },

      clickOnExpandButton: clickable('[data-test-expand-button]'),
      commentCards: collection('[data-test-comment-card]', CommentCard),
      collapseButtons: collection('[data-test-collapse-button]'),

      downvoteButton: {
        hover: triggerable('mouseenter'),
        scope: '[data-test-solution-card-downvote-button]',
      },

      toggleCommentsButtons: collection('[data-test-toggle-comments-button]'),

      upvoteButton: {
        hover: triggerable('mouseenter'),
        scope: '[data-test-solution-card-upvote-button]',
      },
    }),

    scope: '[data-test-code-examples-tab]',

    stageIncompleteModal: {
      clickOnInstructionsButton: clickable('[data-test-instructions-button]'),
      clickOnShowCodeButton: clickable('[data-test-show-code-button]'),
      scope: '[data-test-stage-incomplete-modal]',
    },
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

  currentStepCompleteModal: {
    clickOnNextOrActiveStepButton: clickable('[data-test-next-or-active-step-button]'),

    scope: '[data-test-current-step-complete-modal]',
  },

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

  header: Header,

  earnedBadgeNotice: {
    badgeEarnedModal: {
      badgeName: text('[data-test-badge-name]'),
      resetScope: true,
      scope: '[data-test-badge-earned-modal]',
    },

    scope: '[data-test-earned-badge-notice]',
  },

  feedbackPrompt: FeedbackPrompt,
  firstStageTutorialCard: FirstStageTutorialCard,

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

    feedbackDropdown: FeedbackDropdown,
    languageDropdown: LanguageDropdown,
    scope: '[data-test-language-guide-card]',
  },

  leaderboard: Leaderboard,

  monthlyChallengeBanner: {
    scope: '[data-test-monthly-challenge-banner]',
  },

  repositoryDropdown: RepositoryDropdown,

  previousStepsIncompleteModal: {
    clickOnActiveStepButton: clickable('[data-test-active-step-button]'),
    clickOnJustExploringButton: clickable('[data-test-just-exploring-button]'),
    scope: '[data-test-previous-steps-incomplete-modal]',
  },

  privateLeaderboardFeatureSuggestion: PrivateLeaderboardFeatureSuggestion,

  progressBannerModal: {
    scope: '[data-test-progress-banner-modal]',
  },

  secondStageTutorialCard: SecondStageTutorialCard,

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

  testRunnerCard: {
    borderIsTeal: hasClass('border-teal-500'), // Used when tests have passed

    async clickOnMarkStageAsCompleteButton() {
      await this.markStageAsCompleteButton.click();
    },

    clickOnToggleAlternateClientInstructionsLink: clickable('[data-test-toggle-alternate-client-instructions-link]'),
    clickOnHideInstructionsButton: clickable('[data-test-hide-instructions-button]'),
    copyableTerminalCommands: collection('[data-test-copyable-terminal-command]', CopyableTerminalCommand),

    markStageAsCompleteButton: {
      scope: '[data-test-mark-stage-as-complete-button]',
    },

    isExpanded: isVisible('[data-test-expanded-content]'),
    scope: '[data-test-test-runner-card]',
  },

  upgradeModal: {
    scope: '[data-test-upgrade-modal]',
  },

  upgradePrompt: {
    scope: '[data-test-upgrade-prompt]',
    secondaryCopy: text('[data-test-upgrade-prompt-secondary-copy]'),
  },

  visit: visitable('/courses/:course_slug'),
  yourTaskCard: YourTaskCard,
});
