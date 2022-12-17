import referralsPage from 'codecrafters-frontend/tests/pages/referrals-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | referrals-page | initiate-payout', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can initiate payout', async function (assert) {
    testScenario(this.server);

    const referralLink = this.server.create('referral-link', {
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

    this.server.create('referral-activation', {
      customer: customer1,
      referrer: this.server.schema.users.first(),
      referralLink: referralLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 23700,
      spentAmountInCents: 39500,
    });

    this.server.create('referral-activation', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      referralLink: referralLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 0,
      withdrawableEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    signIn(this.owner, this.server);

    await referralsPage.visit();

    assert.strictEqual(referralsPage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(referralsPage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(referralsPage.lineItemAmountText('Ready to payout'), '$354', 'ready to payout amount is correct');
    assert.strictEqual(referralsPage.lineItemAmountText('Paid out'), '$0', 'paid out amount is correct');

    await referralsPage.initiatePayoutButton.click();

    await percySnapshot('Referrals Page | Create Payout Modal');

    await referralsPage.createPayoutModal.clickOnPayoutMethodCard('PayPal');

    await percySnapshot('Referrals Page | Create Payout Modal | Paypal Form');

    await referralsPage.createPayoutModal.paypalPayoutForm.emailInput.fillIn('abcd@gmail.com');
    await referralsPage.createPayoutModal.paypalPayoutForm.withdrawButton.click();

    await percySnapshot('Referrals Page | Create Payout Modal | Paid out');

    await referralsPage.createPayoutModal.backToReferralsPageButton.click();

    assert.strictEqual(referralsPage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(referralsPage.lineItemAmountText('Pending'), '$237', 'pending amount is correct');
    assert.strictEqual(referralsPage.lineItemAmountText('Ready to payout'), '$0', 'ready to payout amount is correct');
    assert.strictEqual(referralsPage.lineItemAmountText('Paid out'), '$354', 'paid out amount is correct');

    await percySnapshot('Referrals Page | Payout initiated');
  });
});
