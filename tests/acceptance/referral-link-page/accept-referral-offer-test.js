import referralLinkPage from 'codecrafters-frontend/tests/pages/referral-link-page';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import windowMock from 'ember-window-mock';

module('Acceptance | referral-link-page | accept-referral-offer', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
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
  });
});
