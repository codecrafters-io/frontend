import { module, test } from 'qunit';
import percySnapshot from '@percy/ember';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import giftPaymentPage from 'codecrafters-frontend/tests/pages/gift-payment-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import windowMock from 'ember-window-mock';
import { setupWindowMock } from 'ember-window-mock/test-support';

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

  test('user can revisit an existing payment flow with pre-populated data', async function (assert) {
    testScenario(this.server);

    // Create an existing gift payment flow with some data
    const existingFlow = this.server.create('gift-payment-flow', {
      senderEmailAddress: 'existing@codecrafters.io',
      giftMessage: 'This is a pre-existing gift message!',
      pricingPlanId: 'v1-lifetime',
    });

    await giftPaymentPage.visit({ giftPaymentFlowId: existingFlow.id });
    assert.ok(giftPaymentPage.enterDetailsStepContainer.isVisible, 'Enter details step is visible');

    assert.strictEqual(
      giftPaymentPage.enterDetailsStepContainer.senderEmailAddressInputValue,
      'existing@codecrafters.io',
      'Email address is pre-populated',
    );

    assert.strictEqual(
      giftPaymentPage.enterDetailsStepContainer.giftMessageInputValue,
      'This is a pre-existing gift message!',
      'Gift message is pre-populated',
    );

    // Continue with the flow to ensure it still works
    await giftPaymentPage.enterDetailsStepContainer.clickOnContinueButton();
    assert.ok(giftPaymentPage.choosePlanStepContainer.isVisible, 'Choose plan step is visible');

    await giftPaymentPage.choosePlanStepContainer.clickOnContinueButton();
    assert.ok(giftPaymentPage.confirmAndPayStepContainer.isVisible, 'Confirm and pay step is visible');

    await giftPaymentPage.confirmAndPayStepContainer.clickOnPayButton();
    assert.strictEqual(windowMock.location.href, 'https://checkout.stripe.com/test-checkout-session', 'should redirect to Stripe checkout');
  });

  test('email address field is pre-populated with user primary email address', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    user.update({ primaryEmailAddress: 'user@example.com' });
    signIn(this.owner, this.server, user);

    // Ensure the user is synced so the store has the updated primaryEmailAddress
    const authenticator = this.owner.lookup('service:authenticator');
    await authenticator.syncCurrentUser();

    await giftPaymentPage.visit();
    assert.ok(giftPaymentPage.enterDetailsStepContainer.isVisible, 'Enter details step is visible');

    assert.strictEqual(
      giftPaymentPage.enterDetailsStepContainer.senderEmailAddressInputValue,
      'user@example.com',
      'Email address is pre-populated with user primary email address',
    );
  });
});
