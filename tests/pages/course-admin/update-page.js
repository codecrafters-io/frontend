import { attribute, create, visitable } from 'ember-cli-page-object';

export default create({
  applyUpdateButton: {
    scope: '[data-test-apply-update-button]',
  },
  viewDiffLink: {
    scope: '[data-test-view-diff-link]',
    href: attribute('href'),
  },
  visit: visitable('/courses/:course_slug/admin/updates/:update_id'),
});
