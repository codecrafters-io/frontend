import percySnapshot from '@percy/ember';
import referralLinkPage from 'codecrafters-frontend/tests/pages/referral-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'codecrafters-frontend/tests/support/animation-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referral-link-page | view-referral-link', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view referral link when not logged in', async function (assert) {
    testScenario(this.server);

    this.server.create('referral-link', { user: this.server.schema.users.first() });

    await referralLinkPage.visit({ via: 'referral1' });
    assert.ok(referralLinkPage.acceptReferralButton.isVisible);

    await percySnapshot('Referral Link Page | View Referral Link | Anonymous');
  });

  test('can view referral link when logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('referral-link', { user: this.server.schema.users.first() });

    await referralLinkPage.visit({ via: 'referral1' });
    assert.ok(referralLinkPage.acceptReferralButton.isVisible);

    await percySnapshot('Referral Link Page | View Referral Link (anonymous)');
  });

  test('redirects to not found if referral link is invalid', async function (assert) {
    testScenario(this.server);

    await referralLinkPage.visit({ via: 'invalid' });
    assert.strictEqual(currentURL(), '/404');
  });
});
