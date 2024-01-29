import { collection, create, clickOnText, triggerable, visitable } from 'ember-cli-page-object';
import LanguageDropdown from 'codecrafters-frontend/tests/pages/components/course-admin/language-dropdown';

export default create({
  clickOnLink: clickOnText(),

  diffTab: {
    expandableChunks: collection('[data-test-expandable-chunk]'),

    scope: '[data-test-diff-tab]',
  },

  languageDropdown: LanguageDropdown,

  submissionDetails: {
    userProficiencyInfoIcon: {
      hover: triggerable('mouseenter'),
      scope: '[data-test-user-proficiency-info-icon]',
    },

    scope: '[data-test-submission-details]',
  },

  timelineContainer: {
    entries: collection('[data-test-timeline-entry]', {}),
    scope: '[data-test-timeline-container]',
  },

  visit: visitable('/courses/:course_slug/admin/submissions'),
});
