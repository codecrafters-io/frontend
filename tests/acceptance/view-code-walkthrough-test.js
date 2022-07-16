import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | view-code-walkthrough', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders code walkthrough', async function (assert) {
    testScenario(this.server);

    await visit('/walkthroughs/redis-bind-port');
    assert.equal(1, 1);
  });
});
