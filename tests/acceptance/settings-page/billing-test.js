import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber, signInAsVipUser } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import billingPage from 'codecrafters-frontend/tests/pages/settings/billing-page';
import { settled } from '@ember/test-helpers';

module('Acceptance | settings-page | billing-test', function (hooks) {
  setupApplicationTest(hooks);

  test('membership section shows correct plan for subscriber with active subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);
    const subscription = this.server.schema.subscriptions.first();
    subscription.update('pricingPlanName', 'Yearly Plan');

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.hasActivePlan, 'shows active plan');
  });

  test('membership section shows correct plan for subscriber with canceled subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);
    const subscription = this.server.schema.subscriptions.first();
    subscription.update('cancelAt', new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)); // 30 days from now

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.hasActivePlan, 'shows active plan');
  });

  test('membership section shows correct plan for non-subscriber', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.notOk(billingPage.membershipSection.hasActivePlan, 'does not show active plan');
  });

  test('membership section shows VIP access for subscriber with VIP access', async function (assert) {
    testScenario(this.server);
    signInAsVipUser(this.owner, this.server);

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.hasVipAccess, 'shows VIP access');
  });

  test('support section is visible', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.supportSection.isVisible, 'support section is visible');
    // await billingPage.supportSection.clickContactButton();
    // Commented out because it opens the email client, if behavior changes, uncomment
  });

  test('payment history section shows correct information', async function (assert) {
    testScenario(this.server);
    const user = signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.paymentHistorySection.isVisible, 'payment history section is visible');
    assert.equal(billingPage.paymentHistorySection.isEmpty, '', 'shows empty state initially');

    this.server.create('charge', {
      user: user,
      amount: 12000,
      amountRefunded: 0,
      currency: 'usd',
      status: 'succeeded',
    });

    await settled();
    
    await billingPage.visit();
    await settled();
    
    assert.notEqual(billingPage.paymentHistorySection.isEmpty, '', 'shows payment history after charge is created');
  });
});
