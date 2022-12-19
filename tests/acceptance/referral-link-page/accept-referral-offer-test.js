import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import referralLinkPage from 'codecrafters-frontend/tests/pages/referral-link-page';
import { currentURL } from '@ember/test-helpers';
import { setupAnimationTest } from 'codecrafters-frontend/tests/support/animation-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';
import window from 'ember-window-mock';

module('Acceptance | referral-link-page | accept-referral-offer', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('accepting referral offer when not logged in redirects to login', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', { user: this.server.schema.users.first() });

    await referralLinkPage.visit({ via: 'referral1' });
    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(window.location.href, `${window.location.origin}/login?next=%2Fjoin%3Fvia%3Dreferral1`, 'should redirect to login URL');
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

    this.server.create('referral-link', { user: referrer });

    await referralLinkPage.visit({ via: 'referral1' });
    await referralLinkPage.acceptReferralButton.click();

    assert.strictEqual(currentURL(), '/pay', 'should redirect to pay URL');
    await percySnapshot('Pay Page | With Referral Offer');
  });
});
