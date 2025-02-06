import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupAnimationTest, animationsSettled } from 'ember-animated/test-support';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { waitUntil, visit } from '@ember/test-helpers';
import { signIn, signInAsAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import helpscoutBeacon from 'codecrafters-frontend/tests/pages/components/helpscout-beacon';

module('Acceptance | helpscout-beacon', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('beacon renders on catalog page', async function (assert) {
    testScenario(this.server);
    await visit('/catalog');
    await animationsSettled();

    await this.pauseTest();
    assert.ok(helpscoutBeacon.isPresent, 'Helpscout Beacon is present');
    await this.pauseTest();
  });

  test("beacon doesn't render on concepts page", async function (assert) {
    testScenario(this.server);
    await conceptsPage.visit();
    await animationsSettled();

    await this.pauseTest();
    assert.false(helpscoutBeacon.isPresent, 'Helpscout Beacon is not present');
    await this.pauseTest();
  });
});
