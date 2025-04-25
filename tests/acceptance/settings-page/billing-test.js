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

  test('payment history section shows empty state initially', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();
    await settled();

    assert.ok(billingPage.paymentHistorySection.isVisible, 'payment history section is visible');
    assert.equal(billingPage.paymentHistorySection.charges.length, 0, 'shows no charges initially');
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
    assert.equal(billingPage.paymentHistorySection.charges.length, 2, 'shows two charges after creation');
    assert.equal(billingPage.paymentHistorySection.charges[0].amount, '$120', 'shows correct amount for first charge');
    assert.ok(billingPage.paymentHistorySection.charges[0].failed, 'shows failed status for first charge');
    assert.equal(billingPage.paymentHistorySection.charges[1].amount, '$120', 'shows correct amount for second charge');
    assert.notOk(billingPage.paymentHistorySection.charges[1].failed, 'shows succeeded status for second charge');
  });
});
