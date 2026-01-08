import affiliatePage from 'codecrafters-frontend/tests/pages/affiliate-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsAffiliate } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | affiliate-page | initiate-payout', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can initiate payout', async function (assert) {
    testScenario(this.server);

    const affiliateLink = this.server.create('affiliate-link', {
      user: this.server.schema.users.first(),
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

    signInAsAffiliate(this.owner, this.server);

    await affiliatePage.visit();

    assert.strictEqual(affiliatePage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Ready to payout'), '$354', 'ready to payout amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Paid out'), '$0', 'paid out amount is correct');

    await affiliatePage.initiatePayoutButton.click();

    await percySnapshot('Affiliate Page | Create Payout Modal');

    await affiliatePage.createPayoutModal.clickOnPayoutMethodCard('PayPal');

    await percySnapshot('Affiliate Page | Create Payout Modal | Paypal Form');

    await affiliatePage.createPayoutModal.paypalPayoutForm.emailInput.fillIn('abcd@gmail.com');
    await affiliatePage.createPayoutModal.paypalPayoutForm.withdrawButton.click();

    await percySnapshot('Affiliate Page | Create Payout Modal | Paid out');

    await affiliatePage.createPayoutModal.backToAffiliatePageButton.click();

    assert.strictEqual(affiliatePage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Ready to payout'), '$0', 'ready to payout amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Paid out'), '$354', 'paid out amount is correct');

    await percySnapshot('Affiliate Page | Payout initiated');
  });

  test('can initiate payout for lower amount', async function (assert) {
    testScenario(this.server);

    const affiliateLink = this.server.create('affiliate-link', {
      user: this.server.schema.users.first(),
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

    signInAsAffiliate(this.owner, this.server);

    await affiliatePage.visit();

    assert.strictEqual(affiliatePage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Ready to payout'), '$354', 'ready to payout amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Paid out'), '$0', 'paid out amount is correct');

    await affiliatePage.initiatePayoutButton.click();
    await affiliatePage.createPayoutModal.clickOnPayoutMethodCard('PayPal');

    await affiliatePage.createPayoutModal.paypalPayoutForm.emailInput.fillIn('abcd@gmail.com');
    await affiliatePage.createPayoutModal.paypalPayoutForm.amountInput.fillIn('100');
    await affiliatePage.createPayoutModal.paypalPayoutForm.withdrawButton.click();

    await affiliatePage.createPayoutModal.backToAffiliatePageButton.click();

    assert.strictEqual(affiliatePage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Ready to payout'), '$254', 'ready to payout amount is correct');
    assert.strictEqual(affiliatePage.lineItemAmountText('Paid out'), '$100', 'paid out amount is correct');

    assert.strictEqual(this.server.schema.affiliateEarningsPayouts.all().models.length, 1, 'payout is created');
  });
});
