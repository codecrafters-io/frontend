import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import partnerPage from 'codecrafters-frontend/tests/pages/partner-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent, assertTooltipNotRendered } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsAffiliate } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | partner-page | view-affiliate-referrals', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('partner dashboard link is visible to affiliates only', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.true(catalogPage.accountDropdown.hasLink('Partner Dashboard'), 'Expect Partner Dashboard link to be visible');
  });

  test('partner dashboard link redirects to correct page', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Partner Dashboard');

    assert.strictEqual(currentURL(), '/partner', 'Expect to be redirected to partner page');
  });

  test('generate partner link button is not disabled for affiliates', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await partnerPage.visit();
    await partnerPage.getStartedButton.click();

    assert.false(partnerPage.getStartedButton.isVisible, 'Expect generate partner link button to not be visible');
  });

  test('generate partner link button is disabled for non affiliates', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await partnerPage.visit();
    await partnerPage.getStartedButton.click();

    assert.true(partnerPage.getStartedButton.isVisible, 'Expect generate partner link button to still be visible');
  });

  test('generate partner link button does not have a tooltip for affiliates', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await partnerPage.visit();
    await partnerPage.getStartedButton.hover();

    assertTooltipNotRendered(assert);
  });

  test('generate partner link button has a tooltip for non affiliates', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await partnerPage.visit();
    await partnerPage.getStartedButton.hover();

    assertTooltipContent(assert, {
      contentString: 'Contact us at hello@codecrafters.io to apply to be a Partner',
    });
  });

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

    await partnerPage.visit();
    assert.ok(partnerPage.referralStatsPaidUsersText.includes('2'), 'Expect number of paid users to be correct');
    assert.notOk(partnerPage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Partner Page | Referral Stats');
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

    await partnerPage.visit();
    assert.ok(partnerPage.referredUsersContainerText.includes('mrdoob'), 'Expect paid user to be found');
    assert.notOk(partnerPage.referredUsersContainerText.includes('gufran'), 'Expect unpaid user to not be found');
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

    await partnerPage.visit();
    await partnerPage.clickShowAllButton();
    assert.ok(partnerPage.referredUsersContainerText.includes('mrdoob'), 'Expect paid user to be found');
    assert.ok(partnerPage.referredUsersContainerText.includes('gufran'), 'Expect unpaid user to be found');
  });
});
