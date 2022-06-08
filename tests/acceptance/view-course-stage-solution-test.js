import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | view-course-stage-solution', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders solution explanation by default', async function (assert) {
    testScenario(this.server);
    signIn(this.owner);

    await visit('/courses/redis/solutions/ping-pong-multiple');
    assert.equal(currentURL(), '/courses/redis/solutions/ping-pong-multiple/explanation');
  });

  test('it renders solution diff', async function (assert) {
    testScenario(this.server);
    signIn(this.owner);

    await visit('/courses/redis/solutions/ping-pong-multiple/diff');
    assert.equal(currentURL(), '/courses/redis/solutions/ping-pong-multiple/diff');
  });

  test('renders solution explanation', async function (assert) {
    testScenario(this.server);
    signIn(this.owner);

    await visit('/courses/redis/solutions/ping-pong-multiple/explanation');
    assert.equal(currentURL(), '/courses/redis/solutions/ping-pong-multiple/explanation');
  });

  test('renders go solution when no solution is available for requested language', async function (assert) {
    testScenario(this.server);
    signIn(this.owner);

    await visit('/courses/redis/solutions/ping-pong-multiple?language=java');
    assert.equal(currentURL(), '/courses/redis/solutions/ping-pong-multiple/explanation?language=java');
  });
});
