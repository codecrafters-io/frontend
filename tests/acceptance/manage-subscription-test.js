import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | manage-subscription-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('subscriber can manage subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Subscription');

    assert.equal(currentURL(), '/membership');
  });
});
