import affiliatePage from 'codecrafters-frontend/tests/pages/affiliate-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsAffiliate } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | affiliate-page | view-payouts', function (hooks) {
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
      activatedAt: new Date('December 02, 2023'), // 2 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 23700,
      spentAmountInCents: 39500,
    });

    this.server.create('affiliate-referral', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date('December 03, 2023'), // 1 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 0,
      withdrawableEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    this.server.create('affiliate-earnings-payout', {
      user: this.server.schema.users.first(),
      amountInCents: 100_00,
      createdAt: new Date('December 01, 2023'), // 3 days ago
      completedAt: new Date('December 02, 2023'),
      status: 'failed',
      lastFailureReason: 'Unable to find a paypal account for abcd@gmail.com',
    });

    this.server.create('affiliate-earnings-payout', {
      user: this.server.schema.users.first(),
      amountInCents: 100_00,
      createdAt: new Date('December 02, 2023'), // 2 days ago
      completedAt: new Date('December 03, 2023'),
      status: 'completed',
    });

    this.server.create('affiliate-earnings-payout', {
      user: this.server.schema.users.first(),
      amountInCents: 50_00,
      createdAt: new Date('December 03, 2023'), // 1 days ago
      status: 'processing',
    });

    signInAsAffiliate(this.owner, this.server);

    await affiliatePage.visit();

    assert.strictEqual(affiliatePage.totalEarningsAmountText, '$591', 'total earnings amount is correct');
    assert.strictEqual(affiliatePage.payoutHistoryItems.length, 3, 'payout history items are correct');
    assert.true(affiliatePage.payoutHistoryItems.objectAt(0).text.includes('December 2nd, 2023'), 'failed payout shows correct date');
    assert.true(affiliatePage.payoutHistoryItems.objectAt(1).text.includes('December 3rd, 2023'), 'completed payout shows correct date');
    assert.true(affiliatePage.payoutHistoryItems.objectAt(2).text.includes('December 3rd, 2023'), 'processing payout shows correct date');

    await percySnapshot('Affiliate Page | View payouts');
  });
});
