import { attribute, create, visitable } from 'ember-cli-page-object';

export default create({
  activateTesterVersionButton: {
    scope: '[data-test-activate-tester-version-button]',
  },

  deprovisionTestRunnersButton: {
    scope: '[data-test-deprovision-test-runners-button]',
  },

  viewReleaseLink: {
    scope: '[data-test-view-release-link]',
    href: attribute('href'),
  },

  visit: visitable('/courses/:course_slug/admin/tester-versions/:tester_version_id'),
});
