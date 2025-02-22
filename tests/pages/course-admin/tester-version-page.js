import { attribute, clickable, create, text, visitable } from 'ember-cli-page-object';

export default create({
  activateTesterVersionButton: {
    scope: '[data-test-activate-tester-version-button]',
  },

  clickOnBackToTesterVersionsListButton: clickable('[data-test-back-to-tester-versions-list-button]'),
  descriptionText: text('[data-test-description]'),

  deprovisionTestRunnersButton: {
    scope: '[data-test-deprovision-test-runners-button]',
  },

  initiatedDeprovisioningNotice: {
    scope: '[data-test-initiated-deprovisioning-notice]',
  },

  viewReleaseLink: {
    scope: '[data-test-view-release-link]',
    href: attribute('href'),
  },

  visit: visitable('/courses/:course_slug/admin/tester-versions/:tester_version_id'),
});
