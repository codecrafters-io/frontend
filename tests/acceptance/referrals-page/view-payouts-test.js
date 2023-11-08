import partnerPage from 'codecrafters-frontend/tests/pages/partner-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | partner-page | view-payouts', function (hooks) {
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

    this.server.create('referral-earnings-payout', {
      user: this.server.schema.users.first(),
      amountInCents: 100_00,
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 3 days ago
      status: 'failed',
      lastFailureReason: 'Unable to find a paypal account for abcd@gmail.com',
    });

    this.server.create('referral-earnings-payout', {
      user: this.server.schema.users.first(),
      amountInCents: 100_00,
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'completed',
    });

    this.server.create('referral-earnings-payout', {
      user: this.server.schema.users.first(),
      amountInCents: 50_00,
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 1 days ago
      status: 'processing',
    });

    signIn(this.owner, this.server);

    await partnerPage.visit();

    assert.strictEqual(partnerPage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(partnerPage.payoutHistoryItems.length, 3, 'payout history items are correct');

    await percySnapshot('Partner page | View payouts');
  });
});
