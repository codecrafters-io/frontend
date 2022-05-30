import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | view-course-stage-solution', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders solution', async function (assert) {
    testScenario(this.server);

    await visit('/courses/redis/solutions/ping-pong-multiple');
    assert.equal(currentURL(), '/courses/redis/solutions/ping-pong-multiple/diff');
  });
});
