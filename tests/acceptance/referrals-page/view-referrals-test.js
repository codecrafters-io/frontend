import referralsPage from 'codecrafters-frontend/tests/pages/referrals-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | referrals-page | view-referrals', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view referral stats', async function (assert) {
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

    const customer3 = this.server.create('user', {
      avatarUrl: 'https://github.com/torvalds.png',
      createdAt: new Date(),
      githubUsername: 'torvalds',
      username: 'torvalds',
    });

    const customer4 = this.server.create('user', {
      avatarUrl: 'https://github.com/mrdoob.png',
      createdAt: new Date(),
      githubUsername: 'mrdoob',
      username: 'mrdoob',
    });

    this.server.create('affiliate-referral', {
      customer: customer1,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      status: 'pending_trial',
    });

    this.server.create('affiliate-referral', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: 'trialing',
      upcomingPaymentAmountInCents: 59000,
    });

    this.server.create('affiliate-referral', {
      customer: customer3,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    this.server.create('affiliate-referral', {
      customer: customer4,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 0,
      withdrawableEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    signIn(this.owner, this.server);

    await referralsPage.visit();
    assert.ok(referralsPage.referralStatsPaidUsersText.includes('2'), 'Expect number of paid users to be correct');
    assert.notOk(referralsPage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Referrals Page | Referral Stats');
  });

  test('should show paid users by default', async function (assert) {
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

    const customer3 = this.server.create('user', {
      avatarUrl: 'https://github.com/torvalds.png',
      createdAt: new Date(),
      githubUsername: 'torvalds',
      username: 'torvalds',
    });

    const customer4 = this.server.create('user', {
      avatarUrl: 'https://github.com/mrdoob.png',
      createdAt: new Date(),
      githubUsername: 'mrdoob',
      username: 'mrdoob',
    });

    this.server.create('affiliate-referral', {
      customer: customer1,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      status: 'pending_trial',
    });

    this.server.create('affiliate-referral', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: 'trialing',
      upcomingPaymentAmountInCents: 59000,
    });

    this.server.create('affiliate-referral', {
      customer: customer3,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    this.server.create('affiliate-referral', {
      customer: customer4,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 0,
      withdrawableEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    signIn(this.owner, this.server);

    await referralsPage.visit();
    assert.ok(referralsPage.referredUsersContainerText.includes('mrdoob'), 'Expect paid user to be found');
    assert.notOk(referralsPage.referredUsersContainerText.includes('gufran'), 'Expect unpaid user to not be found');
  });

  test('should show unpaid users after clicking show all button', async function (assert) {
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

    const customer3 = this.server.create('user', {
      avatarUrl: 'https://github.com/torvalds.png',
      createdAt: new Date(),
      githubUsername: 'torvalds',
      username: 'torvalds',
    });

    const customer4 = this.server.create('user', {
      avatarUrl: 'https://github.com/mrdoob.png',
      createdAt: new Date(),
      githubUsername: 'mrdoob',
      username: 'mrdoob',
    });

    this.server.create('affiliate-referral', {
      customer: customer1,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      status: 'pending_trial',
    });

    this.server.create('affiliate-referral', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: 'trialing',
      upcomingPaymentAmountInCents: 59000,
    });

    this.server.create('affiliate-referral', {
      customer: customer3,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    this.server.create('affiliate-referral', {
      customer: customer4,
      referrer: this.server.schema.users.first(),
      affiliateLink: affiliateLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), // 1 days ago
      status: 'first_charge_successful',
      withheldEarningsAmountInCents: 0,
      withdrawableEarningsAmountInCents: 35400,
      spentAmountInCents: 59000,
    });

    signIn(this.owner, this.server);

    await referralsPage.visit();
    await referralsPage.clickShowAllButton();
    assert.ok(referralsPage.referredUsersContainerText.includes('mrdoob'), 'Expect paid user to be found');
    assert.ok(referralsPage.referredUsersContainerText.includes('gufran'), 'Expect unpaid user to be found');
  });
});
