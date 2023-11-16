import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import referralPage from 'codecrafters-frontend/tests/pages/referral-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { add, sub } from 'date-fns';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referrals-page | view-referrals', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('get 1 free week link is visible', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.true(catalogPage.accountDropdown.hasLink('Get 1 free week'), 'expect to see Get 1 free week link');
  });

  test('get 1 free week link redirects to correct page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Get 1 free week');

    assert.strictEqual(currentURL(), '/refer', 'expect to be redirected to referrals page');
  });

  test('tracks correct referral stats when no referrals', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
    });

    signIn(this.owner, this.server);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferralsText.includes('0'), 'expect to see 0 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.text.includes('0 (waiting on first referral)'), 'expect to see 0 free weeks left');
    assert.notOk(referralPage.getStartedButton.isVisible, 'expect get started button to be hidden');
  });

  test('tracks correct referral stats when there are referals and free weeks', async function (assert) {
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
      active: true,
      sourceType: 'referred_other_user',
      expiresAt: add(new Date(), { days: 7 }),
    });

    this.server.create('free-usage-grant', {
      user: customer1,
      referralActivation: referralActivation1,
      activatesAt: new Date(),
      active: true,
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
      active: true,
      sourceType: 'referred_other_user',
      expiresAt: add(new Date(), { days: 14 }),
    });

    this.server.create('free-usage-grant', {
      user: customer2,
      referralActivation: referralActivation2,
      activatesAt: new Date(),
      active: true,
      sourceType: 'accepted_referral_offer',
      expiresAt: add(new Date(), { days: 7 }),
    });

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 14 }) });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferralsText.includes('2'), 'expect to see 2 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.countText.includes('2'), 'expect to see 2 free weeks left');
    assert.notOk(referralPage.getStartedButton.isVisible, 'expect get started button to be hidden');

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
      active: false,
      sourceType: 'referred_other_user',
      expiresAt: sub(new Date(), { days: 3 }),
    });

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: sub(new Date(), { days: 3 }) });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferralsText.includes('1'), 'expect to see 1 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.countText.includes('0'), 'expect to see 0 free weeks left');
    assert.notOk(referralPage.getStartedButton.isVisible, 'expect get started button to be hidden');
  });

  test('should show referred users', async function (assert) {
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
      active: true,
      sourceType: 'referred_other_user',
      expiresAt: add(new Date(), { days: 7 }),
    });

    this.server.create('free-usage-grant', {
      user: customer1,
      referralActivation: referralActivation1,
      activatesAt: new Date(),
      active: true,
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
      active: true,
      sourceType: 'referred_other_user',
      expiresAt: add(new Date(), { days: 14 }),
    });

    this.server.create('free-usage-grant', {
      user: customer2,
      referralActivation: referralActivation2,
      activatesAt: new Date(),
      active: true,
      sourceType: 'accepted_referral_offer',
      expiresAt: add(new Date(), { days: 7 }),
    });

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 14 }) });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.ok(referralPage.referralReferredUsersContainerText.includes('sarupbanskota'), 'expect user to be found');
    assert.ok(referralPage.referralReferredUsersContainerText.includes('gufran'), 'expect user to be found');
  });
});
