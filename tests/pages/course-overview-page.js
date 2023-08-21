import { clickable, create, visitable } from 'ember-cli-page-object';

export default create({
  clickOnStartCourse: clickable('[data-test-course-overview-header] [data-test-start-course-button]'),
  visit: visitable('/courses/:course_slug/overview'),
});
