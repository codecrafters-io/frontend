import contestsPage from 'codecrafters-frontend/tests/pages/contests-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

function createContests(server) {
  server.schema.contests.create({
    slug: 'weekly-1',
    name: 'Weekly Contest #1',
    startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    type: 'WeeklyContest',
  });

  server.schema.contests.create({
    slug: 'weekly-2',
    name: 'Weekly Contest #2',
    startsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    endsAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    type: 'WeeklyContest',
  });
}

module('Acceptance | contests-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('can view active contest', async function (assert) {
    testScenario(this.server);
    createContests(this.server);

    signIn(this.owner, this.server);

    await contestsPage.visit();
    assert.strictEqual(currentURL(), '/contests/weekly-1');
    // await this.pauseTest();

    await percySnapshot('Active Contest');
  });
});
