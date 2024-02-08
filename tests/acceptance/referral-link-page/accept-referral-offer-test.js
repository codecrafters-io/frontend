import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import referralLinkPage from 'codecrafters-frontend/tests/pages/referral-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import windowMock from 'ember-window-mock';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referral-link-page | accept-referral-offer', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('accepting referral offer when not logged in redirects to login', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', {
      user: this.server.schema.users.first(),
      slug: 'test-slug',
    });

    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(
      windowMock.location.href,
      `${windowMock.location.origin}/login?next=http%3A%2F%2Flocalhost%3A${window.location.port}%2Fr%2Ftest-slug`,
      'should redirect to login URL',
    );
  });

  test('can accept referral offer', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const referrer = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    this.server.create('referral-link', {
      user: referrer,
      slug: 'test-slug',
    });

    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    await referralLinkPage.acceptReferralButton.click();

    assert.true(referralLinkPage.acceptedReferralNotice.text.includes('Offer Accepted!'), 'should show accepted referral notice');
    assert.true(referralLinkPage.acceptedReferralNotice.text.includes('24 Nov 2023'), 'should show accepted referral notice');

    await percySnapshot('Referral Link Page | Accepted Referral Offer');
  });

  test('offer accepted notice persists if user visits the link again', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const referrer = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    this.server.create('referral-link', {
      user: referrer,
      slug: 'test-slug',
    });

    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });
    await referralLinkPage.acceptReferralButton.click();

    assert.true(referralLinkPage.acceptedReferralNotice.text.includes('Offer Accepted!'), 'should show accepted referral notice');
    assert.true(referralLinkPage.acceptedReferralNotice.text.includes('24 Nov 2023'), 'should show accepted referral notice');

    await catalogPage.visit();
    await referralLinkPage.visit({ referral_link_slug: 'test-slug' });

    assert.true(referralLinkPage.acceptedReferralNotice.text.includes('Offer Accepted!'), 'should show accepted referral notice');
    assert.true(referralLinkPage.acceptedReferralNotice.text.includes('24 Nov 2023'), 'should show accepted referral notice');
  });
});
