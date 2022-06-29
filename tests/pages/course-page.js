import { clickable, clickOnText, collection, create, text, visitable } from 'ember-cli-page-object';
import CollapsedItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/collapsed-item';
import CourseCompletedItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/course-completed-item';
import CourseStageItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/course-stage-item';
import Header from 'codecrafters-frontend/tests/pages/components/header';
import Leaderboard from 'codecrafters-frontend/tests/pages/components/course-page/leaderboard';
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

  courseStageSolutionModal: {
    get isOpen() {
      return this.isVisible;
    },

    activeHeaderTabLinkText: text('[data-test-header-tab-link].border-teal-500'),
    clickOnCloseButton: clickable('[data-test-close-modal-button]'),
    clickOnHeaderTabLink: clickOnText('[data-test-header-tab-link]'),

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

    requestedLanguageNotAvailableNotice: {
      scope: '[data-test-requested-language-not-available-notice]',
    },

    title: text('[data-test-course-stage-solution-modal-title]'),
    scope: '[data-test-course-stage-solution-modal]',
  },

  header: Header,
  leaderboard: Leaderboard,
  repositoryDropdown: RepositoryDropdown,
  setupItem: SetupItem,

  get setupItemIsActive() {
    return this.setupItem.isVisible;
  },

  visit: visitable('/courses/:course_slug'),
});
