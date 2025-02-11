import percySnapshot from '@percy/ember';
import joinTrackPage from 'codecrafters-frontend/tests/pages/join-track-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | view-join-track-page', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view join track page when not logged in', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', { user: this.server.schema.users.first(), slug: 'dummy' });

    await joinTrackPage.visit({ track_slug: 'go' });
    assert.notOk(joinTrackPage.acceptReferralButtons[0].isVisible, 'First button is hidden (for mobile only)');
    assert.ok(joinTrackPage.acceptReferralButtons[1].isVisible, 'Second button is visible (leaderboard)');
    assert.ok(joinTrackPage.acceptReferralButtons[2].isVisible, 'Third button is visible (bottom of page)');
    assert.strictEqual(joinTrackPage.acceptReferralButtons.length, 3, 'Three accept referral buttons are present');

    await percySnapshot('Join Track Page | Anonymous');
  });

  test('can view affiliate link when logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('affiliate-link', { user: this.server.schema.users.first(), slug: 'dummy' });

    await joinTrackPage.visit({ track_slug: 'go' });
    assert.notOk(joinTrackPage.acceptReferralButtons[0].isVisible, 'First button is hidden (for mobile only)');
    assert.ok(joinTrackPage.acceptReferralButtons[1].isVisible, 'Second button is visible (leaderboard)');
    assert.ok(joinTrackPage.acceptReferralButtons[2].isVisible, 'Third button is visible (bottom of page)');
    assert.strictEqual(joinTrackPage.acceptReferralButtons.length, 3, 'Three accept referral buttons are present');

    await percySnapshot('Affiliate Link Page | View Affiliate Link (anonymous)');
  });

  test('redirects to not found if track slug is invalid', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', { user: this.server.schema.users.first(), slug: 'dummy' });

    await joinTrackPage.visit({ track_slug: 'invalid', affiliate_link_slug: 'dummy' });
    assert.strictEqual(currentURL(), '/404');
  });

  test('redirects to not found if affiliate link is invalid', async function (assert) {
    testScenario(this.server);

    await joinTrackPage.visit({ track_slug: 'rust', affiliate_link_slug: 'invalid' });
    assert.strictEqual(currentURL(), '/404');
  });
});
