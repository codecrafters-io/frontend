import badgesPage from 'codecrafters-frontend/tests/pages/badges-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | view-badges', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('badge', { name: 'Test Badge 1' });
    this.server.create('badge', { name: 'Test Badge 2' });

    await badgesPage.visit();
    assert.strictEqual(1, 1);
  });
});
