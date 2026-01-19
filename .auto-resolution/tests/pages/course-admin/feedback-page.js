import { collection, create, visitable } from 'ember-cli-page-object';

export default create({
  feedbackListItems: collection('[data-test-feedback-list-item]'),
  visit: visitable('/courses/:course_slug/admin/feedback'),
});
