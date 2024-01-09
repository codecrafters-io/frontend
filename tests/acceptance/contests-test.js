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
  const user1 = server.create('user', {
    id: 'user-1',
    avatarUrl: 'https://github.com/Gufran.png',
    createdAt: new Date(),
    githubUsername: 'Gufran',
    username: 'Gufran',
  });

  const contest = server.create('contest', {
    slug: 'weekly-2',
    name: 'Weekly Contest #3',
    startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    type: 'WeeklyContest',
  });

  server.schema.leaderboardEntries.create({
    leaderboard: contest.leaderboard,
    user: user1,
    score: 100,
    relatedLanguageSlugs: ['go', 'python'],
  });

  server.create('contest', {
    slug: 'weekly-3',
    name: 'Weekly Contest #3',
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
    assert.strictEqual(currentURL(), '/contests/weekly-2');

    await percySnapshot('Active Contest');
  });
});
