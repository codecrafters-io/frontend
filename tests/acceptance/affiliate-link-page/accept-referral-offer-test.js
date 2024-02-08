import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import affiliateLinkPage from 'codecrafters-frontend/tests/pages/affiliate-link-page';
import { currentURL } from '@ember/test-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';
import windowMock from 'ember-window-mock';

module('Acceptance | affiliate-link-page | accept-referral-offer', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('accepting referral offer when not logged in redirects to login', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', { user: this.server.schema.users.first() });

    await affiliateLinkPage.visit({ via: 'referral1' });
    await affiliateLinkPage.acceptReferralButton.click();

    assert.strictEqual(
      windowMock.location.href,
      `${windowMock.location.origin}/login?next=http%3A%2F%2Flocalhost%3A${window.location.port}%2Fjoin%3Fvia%3Dreferral1`,
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

    this.server.create('affiliate-link', { user: referrer });

    await affiliateLinkPage.visit({ via: 'referral1' });
    await affiliateLinkPage.acceptReferralButton.click();

    assert.strictEqual(currentURL(), '/pay', 'should redirect to pay URL');
    await percySnapshot('Pay Page | With Referral Offer');
  });
});
