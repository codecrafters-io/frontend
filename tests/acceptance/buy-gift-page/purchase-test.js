import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import giftPaymentPage from 'codecrafters-frontend/tests/pages/gift-payment-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';
import windowMock from 'ember-window-mock';
import { waitUntil } from '@ember/test-helpers';

module('Acceptance | buy-gift-page | purchase', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('user can purchase a gift', async function (assert) {
    testScenario(this.server);

    await giftPaymentPage.visit();
    assert.ok(giftPaymentPage.enterDetailsStepContainer.isVisible, 'Enter details step is visible');
    await percySnapshot('Gift Payment - Enter Details Step');

    await giftPaymentPage.enterDetailsStepContainer.fillInSenderEmailAddress('paul@codecrafters.io');
    await giftPaymentPage.enterDetailsStepContainer.fillInGiftMessage('Hey Jess! \n\nHope you enjoy learning with CodeCrafters.');

    await giftPaymentPage.enterDetailsStepContainer.clickOnContinueButton();
    assert.ok(giftPaymentPage.choosePlanStepContainer.isVisible, 'Choose plan step is visible');
    await percySnapshot('Gift Payment - Choose Plan Step');

    await giftPaymentPage.choosePlanStepContainer.clickOnContinueButton();
    assert.ok(giftPaymentPage.confirmAndPayStepContainer.isVisible, 'Confirm and pay step is visible');
    await percySnapshot('Gift Payment - Confirm and Pay Step');

    await giftPaymentPage.confirmAndPayStepContainer.clickOnPayButton();
    assert.strictEqual(windowMock.location.href, 'https://checkout.stripe.com/test-checkout-session', 'should redirect to Stripe checkout');
  });
});
