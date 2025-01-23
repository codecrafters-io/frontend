import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, visit } from '@ember/test-helpers';

module('Acceptance | view-discount-countdown', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    testScenario(this.server);
    this.currentUser = signIn(this.owner, this.server);
  });

  test('it redirects to /tracks page', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    });

    await visit('/');
    assert.strictEqual(currentURL(), '/catalog');

    // await this.pauseTest();
  });
});
