import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import referralPage from 'codecrafters-frontend/tests/pages/referral-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { add, sub } from 'date-fns';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referral-page | view-referrals', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('get 1 week free link is visible', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.true(catalogPage.accountDropdown.hasLink('Get 1 free week'), 'Expect get 1 free week link to be visible');
  });

  test('get 1 free week link redirects to correct page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Get 1 free week');

    assert.strictEqual(currentURL(), '/refer', 'Expect to be redirected to refer page');
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
    assert.true(referralPage.referralStatsReferralsText.includes('0'), 'Expect 0 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.text.includes('0 (waiting on first referral)'), 'Expect 0 free weeks left');
    assert.notOk(referralPage.getStartedButton.isVisible, 'Get Started button is not visible');
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
      validityInHours: 168,
    });

    this.server.create('free-usage-grant', {
      user: customer1,
      referralActivation: referralActivation1,
      activatesAt: new Date(),
      sourceType: 'accepted_referral_offer',
      validityInHours: 168,
    });

    const referralActivation2 = this.server.create('referral-activation', {
      customer: customer2,
      referrer: user,
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user: customer2,
      referralActivation: referralActivation2,
      activatesAt: new Date(),
      sourceType: 'accepted_referral_offer',
      validityInHours: 168,
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation: referralActivation2,
      activatesAt: add(new Date(), { days: 7 }),
      sourceType: 'referred_other_user',
      validityInHours: 168,
    });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferralsText.includes('2'), 'Expect 2 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.count.includes('1'), 'Expect 1 free week left');
    assert.notOk(referralPage.getStartedButton.isVisible, 'Get Started button is not visible');

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

    const customer1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: sub(new Date(), { days: 14 }),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const referralActivation = this.server.create('referral-activation', {
      customer: customer1,
      referrer: user,
      referralLink,
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation,
      activatesAt: sub(new Date(), { days: 10 }),
      sourceType: 'referred_other_user',
      validityInHours: 168,
    });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.true(referralPage.referralStatsReferralsText.includes('1'), 'Expect 1 referrals');
    assert.true(referralPage.referralStatsFreeWeeksLeft.count.includes('0'), 'Expect 0 free weeks left');
    assert.notOk(referralPage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Referral Page | Referral Stats');
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
      sourceType: 'referred_other_user',
      validityInHours: 168,
    });

    this.server.create('free-usage-grant', {
      user: customer1,
      referralActivation: referralActivation1,
      activatesAt: new Date(),
      sourceType: 'accepted_referral_offer',
      validityInHours: 168,
    });

    const referralActivation2 = this.server.create('referral-activation', {
      customer: customer2,
      referrer: user,
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user: customer2,
      referralActivation: referralActivation2,
      activatesAt: new Date(),
      sourceType: 'accepted_referral_offer',
      validityInHours: 168,
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation: referralActivation2,
      activatesAt: add(new Date(), { days: 7 }),
      sourceType: 'referred_other_user',
      validityInHours: 168,
    });

    signIn(this.owner, this.server);

    await referralPage.visit();
    assert.ok(referralPage.referredUsersContainerText.includes('sarupbanskota'), 'Expect paid user to be found');
    assert.ok(referralPage.referredUsersContainerText.includes('gufran'), 'Expect unpaid user to not be found');
  });
});
