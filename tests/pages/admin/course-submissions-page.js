import { collection, create, clickOnText, visitable } from 'ember-cli-page-object';

export default create({
  clickOnLink: clickOnText(),

  timelineContainer: {
    entries: collection('[data-test-timeline-entry]', {}),
    scope: '[data-test-timeline-container]',
  },

  visit: visitable('/admin/courses/:course_slug'),
});
