import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import teamPaymentPage from 'codecrafters-frontend/tests/pages/team-payment-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | team-payment-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('user can setup team', async function (assert) {
    testScenario(this.server);

    await teamPaymentPage.visit();
    await percySnapshot('Team Payment - Team Details Step');

    await teamPaymentPage.teamDetailsStepContainer.fillInTeamName('Test Team');
    await teamPaymentPage.teamDetailsStepContainer.fillInContactEmail('paul@codecrafters.io');
    await teamPaymentPage.teamDetailsStepContainer.blurContactEmailInput();

    await teamPaymentPage.teamDetailsStepContainer.clickOnContinueButton();
    assert.ok(teamPaymentPage.paymentDetailsStepContainer.isVisible, 'Payment details step is visible');

    await percySnapshot('Team Payment - Payment Details Step');

    await teamPaymentPage.paymentDetailsStepContainer.clickOnContinueButton();
    assert.ok(teamPaymentPage.paymentDetailsStepContainer.isVisible, 'Payment details step is visible if error is present');

    await percySnapshot('Team Payment - Payment Details Step - With Error');
  });

  test('user can setup team (after billing method setup)', async function (assert) {
    testScenario(this.server);

    const teamPaymentFlow = this.server.create('team-payment-flow', {
      stripeSetupIntentStatus: 'succeeded',
      teamName: 'Microsoft',
      contactEmailAddress: 'paul@codecrafters.io',
      pricingPlanType: 'yearly',
      numberOfSeats: 10,
    });

    await teamPaymentPage.visit({ f: teamPaymentFlow.id });
    assert.ok(teamPaymentPage.reviewPaymentStepContainer.isVisible);

    await percySnapshot('Team Payment - Review Payment Step');
  });
});
