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

    const customer3 = this.server.create('user', {
      avatarUrl: 'https://github.com/torvalds.png',
      createdAt: new Date(),
      githubUsername: 'torvalds',
      username: 'torvalds',
    });

    this.server.create('referral-activation', {
      customer: customer1,
      referrer: this.server.schema.users.first(),
      referralLink: referralLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      status: 'pending_trial',
    });

    this.server.create('referral-activation', {
      customer: customer2,
      referrer: this.server.schema.users.first(),
      referralLink: referralLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: 'trialing',
    });

    this.server.create('referral-activation', {
      customer: customer3,
      referrer: this.server.schema.users.first(),
      referralLink: referralLink,
      activatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3), // 1 days ago
      status: 'first_payment_completed',
    });

    signIn(this.owner, this.server);

    await referralsPage.visit();
    assert.notOk(referralsPage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Referrals Page | Referral Stats');
  });
});
