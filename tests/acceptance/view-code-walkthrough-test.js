import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import createCodeWalkthrough from 'codecrafters-frontend/mirage/utils/create-code-walkthrough';
import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';

module('Acceptance | view-code-walkthrough', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders code walkthrough', async function (assert) {
    testScenario(this.server);
    createCodeWalkthrough(this.server, 'redis-bind-port');

    await visit('/walkthroughs/redis-bind-port');
    await percySnapshot('Code Walkthrough Page');
    assert.strictEqual(1, 1);
  });
});
