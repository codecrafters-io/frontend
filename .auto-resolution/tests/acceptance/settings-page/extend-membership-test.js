import billingPage from 'codecrafters-frontend/tests/pages/settings/billing-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import windowMock from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | settings-page | extend-membership-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('can extend membership', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const subscription = this.server.schema.subscriptions.first();
    subscription.update('cancelAt', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now

    await billingPage.visit();

    assert.strictEqual(
      billingPage.renewalSection.explanationText,
      'Your membership does not renew automatically. If you extend your membership before expiry, unused time will be added to your new membership.',
      'explanation text is correct',
    );

    await billingPage.renewalSection.extendMembershipButton.click();
    assert.true(billingPage.chooseMembershipPlanModal.isVisible, 'choose membership plan modal is visible');
    await billingPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await billingPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();

    assert.strictEqual(windowMock.location.href, 'https://test.com/checkout_session');

    const individualCheckoutSession = this.server.schema.individualCheckoutSessions.first();

    assert.strictEqual(individualCheckoutSession.cancelUrl, `${window.location.origin}/settings/billing`);
    assert.strictEqual(individualCheckoutSession.successUrl, `${window.location.origin}/settings/billing?action=membership_extended`);
  });

  test('renewal section is not displayed when membership has expired', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server); // Sign in without subscription (no active membership)

    await billingPage.visit();

    assert.false(billingPage.renewalSection.isVisible, 'renewal section is not visible for expired/no membership');
  });

  test('renewal section is not displayed when membership is a lifetime membership', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const subscription = this.server.schema.subscriptions.first();
    // Set cancelAt to more than 50 years from now (lifetime membership)
    subscription.update('cancelAt', new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)); // 100 years from now

    await billingPage.visit();

    assert.false(billingPage.renewalSection.isVisible, 'renewal section is not visible for lifetime membership');
  });
});
