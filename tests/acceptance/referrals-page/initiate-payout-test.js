import partnerPage from 'codecrafters-frontend/tests/pages/partner-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | partner-page | initiate-payout', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can initiate payout', async function (assert) {
    testScenario(this.server);

    const affiliateLink = this.server.create('affiliate-link', {
      user: this.server.schema.users.first(),
      uniqueViewerCount: 10,
    });

    const customer1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const customer2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    this.server.create('affiliate-referral', {
      customer: customer1,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 23700,
      spentAmountInCents: 39500,
    });

    this.server.create('affiliate-referral', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 0,
      withdrawableEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    signIn(this.owner, this.server);

    await partnerPage.visit();

    assert.strictEqual(partnerPage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Ready to payout'), '$354', 'ready to payout amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Paid out'), '$0', 'paid out amount is correct');

    await partnerPage.initiatePayoutButton.click();

    await percySnapshot('Partner Page | Create Payout Modal');

    await partnerPage.createPayoutModal.clickOnPayoutMethodCard('PayPal');

    await percySnapshot('Partner Page | Create Payout Modal | Paypal Form');

    await partnerPage.createPayoutModal.paypalPayoutForm.emailInput.fillIn('abcd@gmail.com');
    await partnerPage.createPayoutModal.paypalPayoutForm.withdrawButton.click();

    await percySnapshot('Partner Page | Create Payout Modal | Paid out');

    await partnerPage.createPayoutModal.backToReferralsPageButton.click();

    assert.strictEqual(partnerPage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Ready to payout'), '$0', 'ready to payout amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Paid out'), '$354', 'paid out amount is correct');

    await percySnapshot('Partner Page | Payout initiated');
  });

  test('can initiate payout for lower amount', async function (assert) {
    testScenario(this.server);

    const affiliateLink = this.server.create('affiliate-link', {
      user: this.server.schema.users.first(),
      uniqueViewerCount: 10,
    });

    const customer1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const customer2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    this.server.create('affiliate-referral', {
      customer: customer1,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 23700,
      spentAmountInCents: 39500,
    });

    this.server.create('affiliate-referral', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 0,
      withdrawableEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    signIn(this.owner, this.server);

    await partnerPage.visit();

    assert.strictEqual(partnerPage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Ready to payout'), '$354', 'ready to payout amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Paid out'), '$0', 'paid out amount is correct');

    await partnerPage.initiatePayoutButton.click();
    await partnerPage.createPayoutModal.clickOnPayoutMethodCard('PayPal');

    await partnerPage.createPayoutModal.paypalPayoutForm.emailInput.fillIn('abcd@gmail.com');
    await partnerPage.createPayoutModal.paypalPayoutForm.amountInput.fillIn('100');
    await partnerPage.createPayoutModal.paypalPayoutForm.withdrawButton.click();

    await partnerPage.createPayoutModal.backToReferralsPageButton.click();

    assert.strictEqual(partnerPage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Ready to payout'), '$254', 'ready to payout amount is correct');
    assert.strictEqual(partnerPage.lineItemAmountText('Paid out'), '$100', 'paid out amount is correct');

    assert.strictEqual(this.server.schema.referralEarningsPayouts.all().models.length, 1, 'payout is created');
  });
});
