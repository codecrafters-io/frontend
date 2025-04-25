import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber, signInAsVipUser } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import billingPage from 'codecrafters-frontend/tests/pages/settings/billing-page';
import { settled } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import window from 'ember-window-mock';
import percySnapshot from '@percy/ember';

module('Acceptance | settings-page | billing-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('membership section shows correct plan for subscriber with active subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);
    const subscription = this.server.schema.subscriptions.first();
    subscription.update('pricingPlanName', 'Yearly Plan');

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.strictEqual(billingPage.membershipSection.text, 'Membership active', 'shows active plan');
    
    await percySnapshot('Billing Page - Active Subscription');
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
    assert.strictEqual(billingPage.membershipSection.text, 'VIP Access', 'shows VIP access');
  });

  test('support section is visible', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.supportSection.isVisible, 'support section is visible');
    assert.ok(billingPage.supportSection.clickOnContactButton, 'click on contact button');

  });

  test('payment history section shows empty state initially', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.paymentHistorySection.isVisible, 'payment history section is visible');
    assert.strictEqual(billingPage.paymentHistorySection.charges.length, 0, 'shows no charges initially');
    assert.dom('[data-test-payment-history-section]').hasText('No payment history found.', 'shows empty state text');
  });

  test('payment history section shows charges after creation', async function (assert) {
    testScenario(this.server);
    const user = signInAsSubscriber(this.owner, this.server);
    user.update({
      id: '63c51e91-e448-4ea9-821b-a80415f266d3',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.server.create('charge', {
      id: 'charge-1',
      user: user,
      amount: 12000,
      amountRefunded: 0,
      currency: 'usd',
      createdAt: new Date(),
      invoiceId: 'invoice-1',
      status: 'failed',
    });

    this.server.create('charge', {
      id: 'charge-2',
      user: user,
      amount: 12000,
      amountRefunded: 0,
      currency: 'usd',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
      invoiceId: 'invoice-2',
      status: 'succeeded',
    });

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.paymentHistorySection.isVisible, 'payment history section is visible');
    assert.strictEqual(billingPage.paymentHistorySection.charges.length, 2, 'shows two charges after creation');
    assert.strictEqual(billingPage.paymentHistorySection.charges[0].amount, '$120', 'shows correct amount for first charge');
    assert.ok(billingPage.paymentHistorySection.charges[0].failed, 'shows failed status for first charge');
    assert.strictEqual(billingPage.paymentHistorySection.charges[1].amount, '$120', 'shows correct amount for second charge');
    assert.notOk(billingPage.paymentHistorySection.charges[1].failed, 'shows succeeded status for second charge');

    await percySnapshot('Billing Page - Payment History with Multiple Charges');
  });

  test('payment history section shows refunded charges correctly', async function (assert) {
    testScenario(this.server);
    const user = signInAsSubscriber(this.owner, this.server);

    // Fully refunded charge
    this.server.create('charge', {
      user: user,
      amount: 12000,
      amountRefunded: 12000,
      currency: 'usd',
      createdAt: new Date(),
      status: 'succeeded',
    });

    // Partially refunded charge
    this.server.create('charge', {
      user: user,
      amount: 12000,
      amountRefunded: 6000,
      currency: 'usd',
      createdAt: new Date(),
      status: 'succeeded',
    });

    await billingPage.visit();
    await settled();

    assert.strictEqual(billingPage.paymentHistorySection.charges.length, 2, 'shows two charges');
    assert.dom('[data-test-refund-text]').exists({ count: 2 }, 'shows refund text for both charges');

    await percySnapshot('Billing Page - Payment History with Refunded Charges');
  });
});
