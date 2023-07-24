import { collection, clickable, clickOnText, create, isVisible, text, visitable, contains } from 'ember-cli-page-object';
import CommentList from 'codecrafters-frontend/tests/pages/components/course-page/comment-list';
import CommentCard from 'codecrafters-frontend/tests/pages/components/comment-card';
import DesktopHeader from 'codecrafters-frontend/tests/pages/components/course-page/desktop-header';
import Sidebar from 'codecrafters-frontend/tests/pages/components/course-page/sidebar';
import Leaderboard from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard';
import PrivateLeaderboardFeatureSuggestion from 'codecrafters-frontend/tests/pages/components/private-leaderboard-feature-suggestion';
import RepositoryDropdown from 'codecrafters-frontend/tests/pages/components/course-page/repository-dropdown';
import RepositorySetupCard from 'codecrafters-frontend/tests/pages/components/course-page/repository-setup-card';
import YourTaskCard from 'codecrafters-frontend/tests/pages/components/course-page/course-stage-step/your-task-card';

export default create({
  courseCompletedCard: {
    clickOnPublishToGithubLink: clickable('span:contains("Click here")'),
    instructionsText: text('[data-test-instructions-text]'),
    scope: '[data-test-course-completed-card]',
  },

  codeExamplesTab: {
    languageDropdown: {
      currentLanguageName: text('[data-test-language-dropdown-trigger] [data-test-current-language-name]', { resetScope: true }),
      toggle: clickable('[data-test-language-dropdown-trigger]', { resetScope: true }),
      clickOnLink: clickOnText('div[role="button"]'),

      hasLink(text) {
        return this.links.toArray().some((link) => link.text.includes(text));
      },

      links: collection('div[role="button"]', {
        text: text(),
      }),

      resetScope: true,
      scope: '[data-test-language-dropdown-content]',
    },

    solutionCards: collection('[data-test-community-solution-card]', {
      clickOnExpandButton: clickable('[data-test-expand-button]'),
      clickOnCollapseButton: clickable('[data-test-collapse-button]'),
      toggleCommentsButtons: collection('[data-test-toggle-comments-button]'),
      commentCards: collection('[data-test-comment-card]', CommentCard),
    }),

    scope: '[data-test-code-examples-tab]',
  },

  commentList: CommentList,

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

  desktopHeader: DesktopHeader,

  earnedBadgeNotice: {
    badgeEarnedModal: {
      badgeName: text('[data-test-badge-name]'),
      resetScope: true,
      scope: '[data-test-badge-earned-modal]',
    },

    clickOnViewButton: clickable('[data-test-view-button]'),
    scope: '[data-test-earned-badge-notice]',
  },

  hasUpgradePrompt: isVisible('[data-test-upgrade-prompt]'),
  leaderboard: Leaderboard,
  repositoryDropdown: RepositoryDropdown,
  privateLeaderboardFeatureSuggestion: PrivateLeaderboardFeatureSuggestion,

  progressBannerModal: {
    scope: '[data-test-progress-banner-modal]',
  },

  sidebar: Sidebar,
  repositorySetupCard: RepositorySetupCard,
  visit: visitable('/courses/:course_slug'),
  yourTaskCard: YourTaskCard,

  hasExpandedSidebar: isVisible('[data-test-course-page-sidebar]'),
  clickOnExpandSidebarButton: clickable('[data-test-expand-sidebar-button]'),
  clickOnCollapseSidebarButton: clickable('[data-test-collapse-sidebar-button]'),
  clickOnExpandLeaderboardButton: clickable('[data-test-expand-leaderboard-button]'),
  clickOnCollapseLeaderboardButton: clickable('[data-test-collapse-leaderboard-button]'),
});
