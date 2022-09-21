import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import teamPaymentPage from 'codecrafters-frontend/tests/pages/team-payment-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | team-payment-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('user can setup team', async function (assert) {
    testScenario(this.server);

    await teamPaymentPage.visit();
    await teamPaymentPage.teamDetailsStepContainer.fillInTeamName('Test Team');
    await teamPaymentPage.teamDetailsStepContainer.fillInContactEmail('paul@codecrafters.io');
    await teamPaymentPage.teamDetailsStepContainer.clickOnContinueButton(); // Blurs previous input, shouldn't do anything
    await teamPaymentPage.teamDetailsStepContainer.clickOnContinueButton(); // This should redirect the user
  });

  test('user can setup team (after billing method setup)', async function (assert) {
    testScenario(this.server);

    const teamPaymentFlow = this.server.create('team-payment-flow', {
      stripeSetupIntentStatus: 'succeeded',
      teamName: 'Microsoft',
      contactEmailAddress: 'paul@codecrafters.io',
      pricingPlanType: 'per_user',
      numberOfSeats: 10,
    });

    await teamPaymentPage.visit({ f: teamPaymentFlow.id });
    assert.ok(teamPaymentPage.reviewPaymentStepContainer.isVisible);
  });
});
