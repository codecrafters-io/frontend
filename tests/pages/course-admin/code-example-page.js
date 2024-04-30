import { clickable, create, visitable } from 'ember-cli-page-object';

export default create({
  pinCodeExampleToggle: {
    scope: '[data-test-pin-code-example-toggle]'
  },

  visit: visitable('/courses/:course_slug/admin/code-examples/:code_example_id'),
});
