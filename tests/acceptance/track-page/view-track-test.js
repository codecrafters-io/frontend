import createLeaderboardEntries from 'codecrafters-frontend/mirage/utils/create-leaderboard-entries';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit } from '@ember/test-helpers';

module('Acceptance | view-track', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);
    createLeaderboardEntries(this.server, 'go', 'redis');

    await visit('/tracks/go');
    assert.equal(1, 1); // dummy assertion

    await percySnapshot('Track - Anonymous User');

    await visit('/tracks/haskell');
    assert.equal(1, 1); // dummy assertion

    await percySnapshot('Track (Generic) - Anonymous User');
  });

  test('it renders for logged-in user', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);
    createLeaderboardEntries(this.server, 'go', 'redis');

    await visit('/tracks/go');
    assert.equal(1, 1); // dummy assertion
  });
});
