import { collection, create, clickOnText, visitable } from 'ember-cli-page-object';

export default create({
  clickOnLink: clickOnText(),
  expandableChunks: collection('[data-test-expandable-chunk]', {}),

  timelineContainer: {
    entries: collection('[data-test-timeline-entry]', {}),
    scope: '[data-test-timeline-container]',
  },

  visit: visitable('/courses/:course_slug/admin/submissions'),
});
