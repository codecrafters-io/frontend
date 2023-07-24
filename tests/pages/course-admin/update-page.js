import { create, visitable } from 'ember-cli-page-object';

export default create({
  applyUpdateButton: {
    scope: '[data-test-apply-update-button]',
  },
  visit: visitable('/courses/:course_slug/admin/updates/:update_id'),
});
