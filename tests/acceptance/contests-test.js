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
    name: 'Weekly Contest #2',
    startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    type: 'WeeklyContest',
  });

  server.schema.leaderboardEntries.create({
    leaderboard: contest.leaderboard,
    user: user1,
    score: 100,
  });

  server.create('contest', {
    slug: 'weekly-3',
    name: 'Weekly Contest #3',
    startsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    endsAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    type: 'WeeklyContest',
  });

  server.create('contest', {
    slug: 'weekly-4',
    name: 'Weekly Contest #4',
    startsAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    endsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
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

    await contestsPage.visit({ contest_slug: 'weekly-2' });
    assert.strictEqual(currentURL(), '/contests/weekly-2');
    // await this.pauseTest();

    await percySnapshot('Active Contest');
  });

  test('time remaining status pill shows correct copy', async function (assert) {
    testScenario(this.server);
    createContests(this.server);

    signIn(this.owner, this.server);

    await contestsPage.visit({ contest_slug: 'weekly-2' });
    assert.strictEqual(contestsPage.timeRemainingStatusPill.text, '3 days left');

    await contestsPage.visit({ contest_slug: 'weekly-3' });
    assert.strictEqual(contestsPage.timeRemainingStatusPill.text, 'Not started');

    await contestsPage.visit({ contest_slug: 'weekly-4' });
    assert.strictEqual(contestsPage.timeRemainingStatusPill.text, 'Ended');
  });
});
