import percySnapshot from '@percy/ember';
import referralPage from 'codecrafters-frontend/tests/pages/referral-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { add, sub } from 'date-fns';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referrals-page | view-referrals', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('tracks correct referral stats when no referrals', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
    });

    signIn(this.owner, this.server);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferrals.text.includes('0'), 'expect to see 0 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.text.includes('0 (waiting on first referral)'), 'expect to see 0 free weeks left');
  });

  test('tracks correct referral stats when there are referrals and free weeks', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    const referralLink = this.server.create('referral-link', {
      user,
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
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

    const referralActivation1 = this.server.create('referral-activation', {
      customer: customer1,
      referrer: user,
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation: referralActivation1,
      activatesAt: new Date(),
      sourceType: 'referred_other_user',
      expiresAt: add(new Date(), { days: 7 }),
    });

    this.server.create('free-usage-grant', {
      user: customer1,
      referralActivation: referralActivation1,
      activatesAt: new Date(),
      sourceType: 'accepted_referral_offer',
      expiresAt: add(new Date(), { days: 7 }),
    });

    const referralActivation2 = this.server.create('referral-activation', {
      customer: customer2,
      referrer: user,
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation: referralActivation2,
      activatesAt: add(new Date(), { days: 7 }),
      sourceType: 'referred_other_user',
      expiresAt: add(new Date(), { days: 14 }),
    });

    this.server.create('free-usage-grant', {
      user: customer2,
      referralActivation: referralActivation2,
      activatesAt: new Date(),
      sourceType: 'accepted_referral_offer',
      expiresAt: add(new Date(), { days: 7 }),
    });

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 14 }) });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferrals.text.includes('2'), 'expect to see 2 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.countText.includes('2'), 'expect to see 2 free weeks left');

    await percySnapshot('Referral Page | Referral Stats');
  });

  test('tracks correct referral stats when there are referrals and expired free weeks', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    const referralLink = this.server.create('referral-link', {
      user,
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
    });

    const customer = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const referralActivation = this.server.create('referral-activation', {
      customer: customer,
      referrer: user,
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation,
      activatesAt: sub(new Date(), { days: 10 }),
      sourceType: 'referred_other_user',
      expiresAt: sub(new Date(), { days: 3 }),
    });

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: sub(new Date(), { days: 3 }) });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferrals.text.includes('1'), 'expect to see 1 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.countText.includes('0'), 'expect to see 0 free weeks left');
  });

  test('referrals info icon has the correct tolltip', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
    });

    signIn(this.owner, this.server);

    await referralPage.visit();
    await referralPage.referralStatsReferrals.infoIcon.hover();

    assertTooltipContent(assert, {
      contentString: "The number of users who've accepted your referral offer.",
    });
  });

  test('free weeks left info icon has the correct tolltip', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
    });

    signIn(this.owner, this.server);

    await referralPage.visit();
    await referralPage.referralStatsFreeWeeksLeft.infoIcon.hover();

    assertTooltipContent(assert, {
      contentString: 'The number of weeks of free access you have left from referrals.',
    });
  });
});
