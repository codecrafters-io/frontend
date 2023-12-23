import { collection, create, clickOnText, visitable } from 'ember-cli-page-object';
import LanguageDropdown from 'codecrafters-frontend/tests/pages/components/course-admin/language-dropdown';

export default create({
  clickOnLink: clickOnText(),

  diffTab: {
    expandableChunks: collection('[data-test-expandable-chunk]'),

    scope: '[data-test-diff-tab]',
  },

  languageDropdown: LanguageDropdown,

  timelineContainer: {
    entries: collection('[data-test-timeline-entry]', {}),
    scope: '[data-test-timeline-container]',
  },

  visit: visitable('/courses/:course_slug/admin/submissions'),
});
