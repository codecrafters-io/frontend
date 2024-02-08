import percySnapshot from '@percy/ember';
import referralLinkPage from 'codecrafters-frontend/tests/pages/referral-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { add, sub } from 'date-fns';

module('Acceptance | referral-link-page | view-referral-link', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view referral link when not logged in', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    assert.ok(referralLinkPage.acceptReferralButton.isVisible);

    await referralLinkPage.acceptReferralButton.hover();

    assertTooltipContent(assert, {
      contentString: 'Click to login via GitHub',
    });

    await percySnapshot('Referral Link Page | View Referral Link | Anonymous');
  });

  test('can view referral link when logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    assert.ok(referralLinkPage.acceptReferralButton.isVisible);
  });

  test('redirects to not found if affiliate link is invalid', async function (assert) {
    testScenario(this.server);

    await referralLinkPage.visit({ referral_link_slug: 'missing-slug' });
    assert.strictEqual(currentURL(), '/404');
  });

  test('button should be disabled if the user is the referrer', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    this.server.create('referral-link', {
      user,
      slug: 'test-slug',
    });

    signIn(this.owner, this.server, user);
    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    await referralLinkPage.acceptReferralButton.hover();

    assertTooltipContent(assert, {
      contentString: "You can't accept your own referral offer.",
    });

    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(currentURL(), '/r/test-slug', 'nothing happens when button is clicked');
  });

  test('button should be disabled if the user is the referrer and has accepted a referral offer', async function (assert) {
    testScenario(this.server);

    const referralLink = this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    const customer = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const referralActivation = this.server.create('referral-activation', {
      customer,
      referrer: this.server.schema.users.first(),
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user: this.server.schema.users.first(),
      referralActivation,
      activatesAt: new Date(),
      active: true,
      expiresAt: add(new Date(), { days: 7 }),
      sourceType: 'referred_other_user',
    });

    const customerFreeUsageGrant = this.server.create('free-usage-grant', {
      user: customer,
      referralActivation,
      activatesAt: new Date(),
      active: true,
      expiresAt: sub(new Date(), { days: 14 }),
      sourceType: 'accepted_referral_offer',
    });

    customer.update({ lastFreeUsageGrantExpiresAt: customerFreeUsageGrant.expiresAt });

    this.server.create('referral-link', {
      user: customer,
      slug: 'customer-slug',
    });

    signIn(this.owner, this.server, customer);
    await referralLinkPage.visit({ referral_link_slug: 'customer-slug' });
    await referralLinkPage.acceptReferralButton.hover();

    assertTooltipContent(assert, {
      contentString: "You can't accept your own referral offer.",
    });

    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(currentURL(), '/r/customer-slug', 'nothing happens when button is clicked');
  });

  test('button should be disabled if referral is already accepted and free usage grant is expired', async function (assert) {
    testScenario(this.server);

    const referralLink = this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    const customer = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const referralActivation = this.server.create('referral-activation', {
      customer,
      referrer: this.server.schema.users.first(),
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user: this.server.schema.users.first(),
      referralActivation,
      activatesAt: new Date(),
      active: true,
      expiresAt: add(new Date(), { days: 7 }),
      sourceType: 'referred_other_user',
    });

    const customerFreeUsageGrant = this.server.create('free-usage-grant', {
      user: customer,
      referralActivation,
      activatesAt: new Date(),
      active: true,
      expiresAt: sub(new Date(), { days: 14 }),
      sourceType: 'accepted_referral_offer',
    });

    customer.update({ lastFreeUsageGrantExpiresAt: customerFreeUsageGrant.expiresAt });

    signIn(this.owner, this.server, customer);
    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    await referralLinkPage.acceptReferralButton.hover();

    assertTooltipContent(assert, {
      contentString: "You've already accepted another referral offer. You can refer other users to get more free weeks. Visit /refer to get started.",
    });

    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(currentURL(), '/r/test-slug', 'nothing happens when button is clicked');
  });

  test('button should be disabled if referral already has paid access', async function (assert) {
    testScenario(this.server);

    const user = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    user.update({ isVip: true });

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    signIn(this.owner, this.server, user);
    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    await referralLinkPage.acceptReferralButton.hover();

    assertTooltipContent(assert, {
      contentString: 'As a CodeCrafters member, you already have full access.',
    });

    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(currentURL(), '/r/test-slug', 'nothing happens when button is clicked');
  });
});
