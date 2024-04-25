import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import referralPage from 'codecrafters-frontend/tests/pages/referral-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { add, sub } from 'date-fns';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referrals-page | view-referrals', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('referrals link is visible', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.true(catalogPage.accountDropdown.hasLink('Referrals'), 'expect to see Get 1 free week link');
  });

  test('referrals link redirects to correct page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Referrals');

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

  test('referrals info icon has the correct tooltip', async function (assert) {
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

  test('free weeks left info icon has the correct tooltip', async function (assert) {
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

  test('should show referred users', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    const currentDate = new Date('2023-11-17');

    const referralLink = this.server.create('referral-link', {
      user,
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
    });

    const customer1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: currentDate,
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const customer2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: currentDate,
      githubUsername: 'gufran',
      username: 'gufran',
    });

    const referralActivation1 = this.server.create('referral-activation', {
      customer: customer1,
      referrer: user,
      referralLink,
      createdAt: currentDate,
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation: referralActivation1,
      activatesAt: currentDate,
      sourceType: 'referred_other_user',
      expiresAt: add(currentDate, { days: 7 }),
    });

    this.server.create('free-usage-grant', {
      user: customer1,
      referralActivation: referralActivation1,
      activatesAt: currentDate,
      sourceType: 'accepted_referral_offer',
      expiresAt: add(currentDate, { days: 7 }),
    });

    const referralActivation2 = this.server.create('referral-activation', {
      customer: customer2,
      referrer: user,
      referralLink,
      createdAt: currentDate,
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation: referralActivation2,
      activatesAt: add(currentDate, { days: 7 }),
      sourceType: 'referred_other_user',
      expiresAt: add(currentDate, { days: 14 }),
    });

    this.server.create('free-usage-grant', {
      user: customer2,
      referralActivation: referralActivation2,
      activatesAt: currentDate,
      sourceType: 'accepted_referral_offer',
      expiresAt: add(currentDate, { days: 7 }),
    });

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(currentDate, { days: 14 }) });

    signIn(this.owner, this.server, user);

    await referralPage.visit();
    assert.ok(referralPage.referralReferredUsersContainer.text.includes('sarupbanskota'), 'expect user to be found');
    assert.ok(referralPage.referralReferredUsersContainer.text.includes('gufran'), 'expect user to be found');
    assert.ok(
      referralPage.referralReferredUsersContainer.durationPill[0].text.includes('17 Nov - 24 Nov'),
      'expect duration pill to show correct duration',
    );

    await referralPage.referralReferredUsersContainer.durationPill[0].hover();

    assertTooltipContent(assert, {
      contentString: 'This referral grants you free access from 17 November 2023 to 24 November 2023.',
    });
  });

  test('header should have a badge that shows the remaining time in days', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 7 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();

    assert.true(catalogPage.header.freeWeeksLeftButton.text.includes('7 days free'), 'expect badge to show correct duration for days');

    await percySnapshot('Header | Has free usage grants');
  });

  test('header should have a badge that shows the remaining time in days when expiry is a couple month away', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 60 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();

    assert.true(
      catalogPage.header.freeWeeksLeftButton.text.includes('60 days free'),
      'expect badge to show correct duration for days when more than a week/month',
    );
  });

  test('header should have a badge that shows the remaining time in hours', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { hours: 7 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();

    assert.true(catalogPage.header.freeWeeksLeftButton.text.includes('7 hours free'), 'expect badge to show correct duration for hours');
  });

  test('header should have a badge that shows the remaining time in minutes', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { minutes: 15 }) });
    signIn(this.owner, this.server, user);

    await catalogPage.visit();

    assert.true(catalogPage.header.freeWeeksLeftButton.text.includes('15 minutes free'), 'expect badge to show correct duration for minutes');
  });

  test('header should have a badge that shows the remaining time in minutes when less than a minute left', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { seconds: 30 }) });
    signIn(this.owner, this.server, user);

    await catalogPage.visit();

    assert.true(
      catalogPage.header.freeWeeksLeftButton.text.includes('1 minute free'),
      'expect badge to show correct duration for minutes when less than a minute left',
    );
  });

  test('header should show vip badge if user has active free usage grant', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 7 }) });
    user.update({ isVip: true });
    signIn(this.owner, this.server, user);

    await catalogPage.visit();

    assert.true(catalogPage.header.vipBadge.isVisible, 'expect vip badge to be visible');
    assert.false(catalogPage.header.freeWeeksLeftButton.isVisible, 'expect free weeks left badge to be hidden');

    await percySnapshot('Header | Has VIP status');
  });

  test('header should show subscribe button when not vip and has expired free usage grants', async function (assert) {
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

    user.update({ hasActiveFreeUsageGrants: false, lastFreeUsageGrantExpiresAt: sub(new Date(), { days: 3 }) });
    signIn(this.owner, this.server, user);

    await catalogPage.visit();

    assert.true(catalogPage.header.upgradeButton.isVisible, 'expect subscribe button to be visible');
    assert.false(catalogPage.header.vipBadge.isVisible, 'expect vip badge to be hidden');
    assert.false(catalogPage.header.freeWeeksLeftButton.isVisible, 'expect free weeks left badge to be hidden');

    await percySnapshot('Header | Has no VIP status and free usage grants');
  });

  test('free weeks left button redirects to /pay', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 7 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.header.freeWeeksLeftButton.click();

    assert.strictEqual(currentURL(), '/pay', 'expect to be redirected to refer page');
  });
});
