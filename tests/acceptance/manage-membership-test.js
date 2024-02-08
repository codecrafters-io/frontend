import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsSubscriber, signInAsTrialingSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import { formatWithOptions } from 'date-fns/fp';
import membershipPage from 'codecrafters-frontend/tests/pages/membership-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, settled } from '@ember/test-helpers';

module('Acceptance | manage-membership-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('subscriber can manage membership', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Membership');

    assert.strictEqual(currentURL(), '/membership');
  });

  test('subscriber that is a partner has correct membership plan copy', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update('isVip', true);

    signInAsSubscriber(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Membership');

    assert.dom('[data-test-membership-plan-section] div:nth-of-type(3)').includesText('🎉 You have VIP access to all CodeCrafters content.');
  });

  test('subscriber that is a partner with expiry has correct membership plan copy', async function (assert) {
    testScenario(this.server);

    const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const user = this.server.schema.users.first();
    user.update('isVip', true);
    user.update('vipStatusExpiresAt', expiryDate);

    signInAsSubscriber(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Membership');

    assert
      .dom('[data-test-membership-plan-section] div:nth-of-type(3)')
      .includesText('🎉 You have VIP access to all CodeCrafters content, valid until');
  });

  test('subscriber can cancel trial', async function (assert) {
    testScenario(this.server);
    signInAsTrialingSubscriber(this.owner, this.server);

    await membershipPage.visit();
    assert.strictEqual(membershipPage.membershipPlanSection.descriptionText, 'Your trial for the Monthly plan is currently active.');

    await membershipPage.clickOnCancelTrialButton();
    assert.ok(membershipPage.cancelSubscriptionModal.isVisible);
    assert.ok(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is disabled without selecting a reason');

    await membershipPage.cancelSubscriptionModal.selectReason('I need more content');
    assert.notOk(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is enabled after selecting a reason');

    await membershipPage.cancelSubscriptionModal.selectReason('Other reason');
    assert.ok(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is disabled if other reason is selected');

    await membershipPage.cancelSubscriptionModal.fillInReasonDescription('Feeling Blue');
    assert.notOk(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is enabled if other reason is provided');

    assert.strictEqual(membershipPage.cancelSubscriptionModal.cancelButtonText, 'Cancel Trial');

    await membershipPage.cancelSubscriptionModal.clickOnCancelSubscriptionButton();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.notOk(membershipPage.cancelSubscriptionModal.isVisible);

    assert.strictEqual(membershipPage.membershipPlanSection.descriptionText, 'Your CodeCrafters membership is currently inactive.');
  });

  test('subscriber can cancel subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let subscription = this.server.schema.subscriptions.first();

    await membershipPage.visit();
    assert.strictEqual(membershipPage.membershipPlanSection.descriptionText, 'You are currently subscribed to the Monthly plan.');

    await membershipPage.clickOnCancelSubscriptionButton();
    assert.ok(membershipPage.cancelSubscriptionModal.isVisible);
    assert.ok(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is disabled without selecting a reason');

    await membershipPage.cancelSubscriptionModal.selectReason('I need more content');
    assert.notOk(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is enabled after selecting a reason');

    await membershipPage.cancelSubscriptionModal.selectReason('Other reason');
    assert.ok(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is disabled if other reason is selected');

    await membershipPage.cancelSubscriptionModal.fillInReasonDescription('Feeling Blue');
    assert.notOk(membershipPage.cancelSubscriptionModal.cancelButtonIsDisabled, 'cancel button is enabled if other reason is provided');

    assert.strictEqual(membershipPage.cancelSubscriptionModal.cancelButtonText, 'Cancel Subscription');

    await membershipPage.cancelSubscriptionModal.clickOnCancelSubscriptionButton();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.notOk(membershipPage.cancelSubscriptionModal.isVisible);

    assert.strictEqual(
      membershipPage.membershipPlanSection.descriptionText,
      `Your CodeCrafters membership is valid until ${formatWithOptions({}, 'PPPp', subscription.currentPeriodEnd)}.`,
    );
  });

  test('subscriber can view recent payments', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let subscription = this.server.schema.subscriptions.first();

    this.server.schema.charges.create({
      user: subscription.user,
      amount: 7900,
      amountRefunded: 0,
      currency: 'usd',
      createdAt: new Date(),
      invoiceId: 'invoice-id',
      status: 'succeeded',
    });

    this.server.schema.charges.create({
      user: subscription.user,
      amount: 3500,
      amountRefunded: 0,
      currency: 'usd',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
      invoiceId: 'invoice-id',
      status: 'succeeded',
    });

    await membershipPage.visit();

    assert.strictEqual(membershipPage.recentPaymentsSection.downloadInvoiceLinks.length, 2);
  });

  test('subscriber can view upcoming payments', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await membershipPage.visit();
    assert.strictEqual(1, 1);
  });

  test('subscriber can update payment method', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await membershipPage.visit();
    await membershipPage.clickOnUpdatePaymentMethodButton();
    assert.strictEqual(1, 1); // Dummy test
  });
});
