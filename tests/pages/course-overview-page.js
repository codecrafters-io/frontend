import { clickable, create, visitable, text } from 'ember-cli-page-object';

export default create({
  betaNoticeText: text('[data-test-course-beta-notice]'),
  clickOnShowAllButton: clickable('[data-test-show-all-button]'),
  clickOnStartCourse: clickable('[data-test-course-overview-header] [data-test-start-course-button]'),
  freeNoticeText: text('[data-test-course-free-notice]'),
  visit: visitable('/courses/:course_slug/overview'),
});
