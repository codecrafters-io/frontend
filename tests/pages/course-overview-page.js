import { clickable, create, visitable, text } from 'ember-cli-page-object';

export default create({
  adminPanel: {
    clickOnStartCourse: clickable('[data-test-start-course-button]'),
    scope: '[data-test-admin-panel]',
  },

  betaNoticeText: text('[data-test-course-beta-notice]'),
  clickOnStartCourse: clickable('[data-test-course-overview-header] [data-test-start-course-button]'),
  freeNoticeText: text('[data-test-course-free-notice]'),
  visit: visitable('/courses/:course_slug/overview'),
});
