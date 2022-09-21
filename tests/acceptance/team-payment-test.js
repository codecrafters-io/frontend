import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import teamPaymentPage from 'codecrafters-frontend/tests/pages/team-payment-page';
import percySnapshot from '@percy/ember';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | team-payment-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('user can setup team', async function (assert) {
    testScenario(this.server);

    await teamPaymentPage.visit();
    await teamPaymentPage.teamDetailsForm.fillInTeamName('Test Team');
    await teamPaymentPage.teamDetailsForm.fillInContactEmail('paul@codecrafters.io');
    await teamPaymentPage.teamDetailsForm.clickOnContinueButton(); // Blurs previous input, shouldn't do anything
    await teamPaymentPage.teamDetailsForm.clickOnContinueButton();

    assert.equal(1, 1);
  });
});
