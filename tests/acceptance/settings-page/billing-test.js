import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import {
  signIn,
  signInAsInstitutionMembershipGrantRecipient,
  signInAsSubscriber,
  signInAsVipUser,
} from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import billingPage from 'codecrafters-frontend/tests/pages/settings/billing-page';
import { setupWindowMock } from 'ember-window-mock/test-support';
import percySnapshot from '@percy/ember';
import createInstitution from 'codecrafters-frontend/mirage/utils/create-institution';

module('Acceptance | settings-page | billing-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('membership section shows correct plan for subscriber with active subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);
    const subscription = this.server.schema.subscriptions.first();
    subscription.update('cancelAt', new Date('2035-07-31T01:00:00Z'));

    await billingPage.visit();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.text.includes('Membership active'), 'shows active plan');

    assert.ok(
      billingPage.membershipSection.text.includes('You have access to all CodeCrafters content, valid until July 31st, 2035'),
      'shows correct end of current period',
    );

    await percySnapshot('Billing Page - Active Subscription');
  });

  test('membership section shows rollover days when subscription has rollover validity', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);
    const subscription = this.server.schema.subscriptions.first();
    subscription.update('cancelAt', new Date('2035-07-31T01:00:00Z'));
    subscription.update('rolloverValidityInDays', 15);

    await billingPage.visit();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.text.includes('Membership active'), 'shows active plan');
    assert.ok(
      billingPage.membershipSection.text.includes('This includes 15 days rolled over from a previous membership'),
      'shows rollover days message',
    );

    await percySnapshot('Billing Page - Active Subscription with Rollover Days');
  });

  test('membership section shows correct plan for subscriber with institution membership', async function (assert) {
    testScenario(this.server);
    createInstitution(this.server, 'nus');
    signInAsInstitutionMembershipGrantRecipient(this.owner, this.server);
    const subscription = this.server.schema.subscriptions.first();
    subscription.update('cancelAt', new Date('2035-07-31T01:00:00Z'));

    await billingPage.visit();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.text.includes('Campus Program'), 'shows campus program');

    assert.ok(
      billingPage.membershipSection.text.includes(
        'Your affiliation with NUS grants you access to all CodeCrafters content, valid until July 31st, 2035',
      ),
      'shows correct end of current period',
    );

    await percySnapshot('Billing Page - Institution Membership');
  });

  test('membership section shows correct plan for subscriber with VIP access', async function (assert) {
    testScenario(this.server);
    let user = signInAsSubscriber(this.owner, this.server);
    user.update('isVip', true);
    user.update('vipStatusExpiresAt', new Date('2035-08-31T01:00:00Z'));
    const subscription = this.server.schema.subscriptions.first();
    subscription.update('cancelAt', new Date('2035-07-31T01:00:00Z'));

    await billingPage.visit();

    assert.ok(billingPage.membershipSection.text.includes('Membership active'), 'shows active plan');
    assert.ok(
      billingPage.membershipSection.text.includes('You have access to all CodeCrafters content, valid until July 31st, 2035'),
      'shows correct end of current period as line through text',
    );

    assert.ok(billingPage.membershipSection.text.includes('VIP access'), 'shows VIP access');
    assert.ok(
      billingPage.membershipSection.text.includes('You have VIP access to all CodeCrafters content, valid until August 31st, 2035'),
      'shows correct VIP access expiry date',
    );

    await percySnapshot('Billing Page - VIP Access with Active Subscription');
  });

  test('membership section shows correct plan for non-subscriber', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await billingPage.visit();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.text.includes('No membership found'), 'does not show active plan');
    await percySnapshot('Billing Page - No Active Subscription');
  });

  test('membership section shows VIP access for user with VIP access', async function (assert) {
    testScenario(this.server);
    let user = signInAsVipUser(this.owner, this.server);
    user.update('vipStatusExpiresAt', new Date('2035-08-31T01:00:00Z'));

    await billingPage.visit();

    assert.ok(billingPage.membershipSection.isVisible, 'membership section is visible');
    assert.ok(billingPage.membershipSection.text.includes('VIP Access'), 'shows VIP access');

    assert.ok(
      billingPage.membershipSection.text.includes('You have VIP access to all CodeCrafters content, valid until August 31st, 2035'),
      'shows correct VIP access expiry date',
    );

    await percySnapshot('Billing Page - VIP Access');
  });

  test('support section is visible', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();

    assert.ok(billingPage.supportSection.isVisible, 'support section is visible');
    assert.strictEqual(
      billingPage.supportSection.contactButtonHref,
      'mailto:hello@codecrafters.io?subject=Billing help (account: rohitpaulk)',
      'contact button href is correct',
    );
  });

  test('payment history section shows empty state initially', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();

    assert.ok(billingPage.paymentHistorySection.isVisible, 'payment history section is visible');
    assert.strictEqual(billingPage.paymentHistorySection.charges.length, 0, 'shows no charges initially');
    assert.ok(billingPage.paymentHistorySection.text.includes('No payments found.'), 'shows empty state text');
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

    assert.strictEqual(billingPage.paymentHistorySection.charges.length, 2, 'shows two charges');
    assert.strictEqual(billingPage.paymentHistorySection.charges[0].refundText, '(refunded)', 'shows refund text for first charge');
    assert.strictEqual(billingPage.paymentHistorySection.charges[1].refundText, '($60 refunded)', 'shows refund text for second charge');

    await percySnapshot('Billing Page - Payment History with Refunded Charges');
  });

  test('membership extended notice is shown when visiting with action query param', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await visit('/settings/billing?action=membership_extended');

    assert.true(billingPage.membershipExtendedNotice.isVisible, 'membership extended notice is visible');
    assert.strictEqual(currentURL(), '/settings/billing', 'query param is cleared from URL');
  });

  test('membership extended notice can be dismissed', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await visit('/settings/billing?action=membership_extended');

    assert.true(billingPage.membershipExtendedNotice.isVisible, 'membership extended notice is visible');

    await billingPage.membershipExtendedNotice.clickDismissButton();

    assert.false(billingPage.membershipExtendedNotice.isVisible, 'membership extended notice is dismissed');
  });

  test('membership extended notice is not shown on normal page visit', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await billingPage.visit();

    assert.false(billingPage.membershipExtendedNotice.isVisible, 'membership extended notice is not visible');
  });

  test('membership expiry discount is shown in extend membership modal', async function (assert) {
    testScenario(this.server);
    const user = signInAsSubscriber(this.owner, this.server);

    this.server.schema.promotionalDiscounts.create({
      user: user,
      type: 'membership_expiry',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    await billingPage.visit();
    await billingPage.renewalSection.extendMembershipButton.click();

    assert.true(billingPage.chooseMembershipPlanModal.isVisible, 'modal is visible');

    const yearlyPlanCard = billingPage.chooseMembershipPlanModal.planCards[1];
    assert.true(yearlyPlanCard.promotionalDiscountNotice.isVisible, 'promotional discount notice is visible on yearly plan');
    assert.true(yearlyPlanCard.promotionalDiscountNotice.text.includes('Early renewal discount'), 'shows early renewal discount text');
    assert.strictEqual(yearlyPlanCard.discountedPriceText, '$216', 'shows correct discounted price (40% off $360)');
  });
});
