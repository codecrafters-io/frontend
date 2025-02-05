import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupAnimationTest, animationsSettled } from 'ember-animated/test-support';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { waitUntil, visit } from '@ember/test-helpers';
// import { pauseTest } from '@ember/test-helpers';
import { signIn, signInAsAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';

module('Acceptance | helpscout-beacon', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('beacon renders on catalog page', async function (assert) {
    testScenario(this.server);
    await visit('/catalog');
    await animationsSettled();

    // await waitUntil(() => window.Beacon, { timeout: 1000 });

    assert.ok(window.Beacon, 'Helpscout Beacon is initialized');
    assert.strictEqual(typeof window.Beacon, 'function', 'Beacon function is available');
    window.Beacon('init', 'bb089ae9-a4ae-4114-8f7a-b660f6310158');
    window.Beacon('info');
    console.log('window.Beacon', window.Beacon);
    console.log(window.Beacon('info'));
    // await pauseTest();
});

  test("beacon doesn't render on concepts page", async function (assert) {
    testScenario(this.server);

    signInAsAdmin(this.owner, this.server);
    await catalogPage.visit();

    // await pauseTest();
    await catalogPage.header.clickOnHeaderLink('Badges');

    await animationsSettled();

    // await waitUntil(() => window.Beacon, { timeout: 1000 });

    assert.ok(!window.Beacon, 'Helpscout Beacon is not initialized');
    assert.strictEqual(typeof window.Beacon, 'undefined', 'Beacon function is not available');
    console.log('window.Beacon', window.Beacon);
    console.log(window.Beacon('info'));
    // await pauseTest();
  });
});
