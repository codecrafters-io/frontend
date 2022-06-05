import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, visit } from '@ember/test-helpers';

module('Acceptance | view-index', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it redirects to /tracks page', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await visit('/');
    assert.equal(currentURL(), '/tracks');
  });
});
