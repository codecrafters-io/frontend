import percySnapshot from '@percy/ember';
import referralLinkPage from 'codecrafters-frontend/tests/pages/referral-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referral-link-page | view-referral-link', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view referral link when not logged in', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    assert.ok(referralLinkPage.acceptReferralButton.isVisible);

    await percySnapshot('Referral Link Page | View Referral Link | Anonymous');
  });

  test('can view affiliate link when logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    assert.ok(referralLinkPage.acceptReferralButton.isVisible);

    await percySnapshot('Referral Link Page | View Referral Link (anonymous)');
  });

  test('redirects to not found if affiliate link is invalid', async function (assert) {
    testScenario(this.server);

    await referralLinkPage.visit({ referral_link_slug: 'missing-slug' });
    assert.strictEqual(currentURL(), '/404');
  });

  test('button should be disabled if referral is already accepted', async function (assert) {
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
      sourceType: 'referred_other_user',
      validityInHours: 168,
    });

    this.server.create('free-usage-grant', {
      user: customer,
      referralActivation,
      activatesAt: new Date(),
      sourceType: 'accepted_referral_offer',
      validityInHours: 168,
    });

    signIn(this.owner, this.server, customer);
    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
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
    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(currentURL(), '/r/test-slug', 'nothing happens when button is clicked');
  });
});
