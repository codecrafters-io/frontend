import { clickable, collection, create, isPresent, text, visitable } from 'ember-cli-page-object';

export default create({
  adminPanel: {
    clickOnStartCourse: clickable('[data-test-start-course-button]'),
    scope: '[data-test-admin-panel]',
  },

  betaNoticeText: text('[data-test-course-beta-notice]'),
  clickOnStartCourse: clickable('[data-test-course-overview-header] [data-test-start-course-button]'),
  deprecatedNoticeText: text('[data-test-course-deprecated-notice]'),
  freeNoticeText: text('[data-test-course-free-notice]'),
  stageListItems: collection('[data-test-stage-list-item]', {
    hasCompletionCheckmark: isPresent('[data-test-stage-complete-checkmark]'),
    hasDifficultyLabel: isPresent('[data-test-course-difficulty-label]'),
  }),
  visit: visitable('/courses/:course_slug/overview'),
});
