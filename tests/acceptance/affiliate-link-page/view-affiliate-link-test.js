import percySnapshot from '@percy/ember';
import affiliateLinkPage from 'codecrafters-frontend/tests/pages/affiliate-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | affiliate-link-page | view-affiliate-link', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view affiliate link when not logged in', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', { user: this.server.schema.users.first() });

    await affiliateLinkPage.visit({ via: 'referral1' });
    assert.ok(affiliateLinkPage.acceptReferralButton.isVisible);

    await percySnapshot('Affiliate Link Page | View Affiliate Link | Anonymous');
  });

  test('can view affiliate link when logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('affiliate-link', { user: this.server.schema.users.first() });

    await affiliateLinkPage.visit({ via: 'referral1' });
    assert.ok(affiliateLinkPage.acceptReferralButton.isVisible);

    await percySnapshot('Affiliate Link Page | View Affiliate Link (anonymous)');
  });

  test('redirects to not found if affiliate link is invalid', async function (assert) {
    testScenario(this.server);

    await affiliateLinkPage.visit({ via: 'invalid' });
    assert.strictEqual(currentURL(), '/404');
  });
});
