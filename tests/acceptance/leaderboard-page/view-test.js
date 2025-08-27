import { currentURL } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import leaderboardPage from 'codecrafters-frontend/tests/pages/leaderboard-page';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { module, test } from 'qunit';

module('Acceptance | leaderboard-page | view', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('can view', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const user1 = this.server.create('user', {
      id: 'user-1',
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'Gufran',
      username: 'Gufran',
    });

    const user2 = this.server.create('user', {
      id: 'user-2',
      avatarUrl: 'https://github.com/torvalds.png',
      createdAt: new Date(),
      githubUsername: 'torvalds',
      username: 'torvalds',
    });

    const user3 = this.server.create('user', {
      id: 'user-3',
      avatarUrl: 'https://github.com/addyosmani.png',
      createdAt: new Date(),
      githubUsername: 'addyosmani',
      username: 'addyosmani',
    });

    const user4 = this.server.create('user', {
      id: 'user-4',
      avatarUrl: 'https://github.com/gaearon.png',
      createdAt: new Date(),
      githubUsername: 'gaearon',
      username: 'gaearon',
    });

    const user5 = this.server.create('user', {
      id: 'user-5',
      avatarUrl: 'https://github.com/yyx990803.png',
      createdAt: new Date(),
      githubUsername: 'yyx990803',
      username: 'yyx990803',
    });

    const user6 = this.server.create('user', {
      id: 'user-6',
      avatarUrl: 'https://github.com/getify.png',
      createdAt: new Date(),
      githubUsername: 'getify',
      username: 'getify',
    });

    const user7 = this.server.create('user', {
      id: 'user-7',
      avatarUrl: 'https://github.com/rauchg.png',
      createdAt: new Date(),
      githubUsername: 'rauchg',
      username: 'rauchg',
    });

    const user8 = this.server.create('user', {
      id: 'user-8',
      avatarUrl: 'https://github.com/addyosmani.png',
      createdAt: new Date(),
      githubUsername: 'addyosmani',
      username: 'addyosmani',
    });

    const user9 = this.server.create('user', {
      id: 'user-9',
      avatarUrl: 'https://github.com/ry.png',
      createdAt: new Date(),
      githubUsername: 'ry',
      username: 'ry',
    });

    const user10 = this.server.create('user', {
      id: 'user-10',
      avatarUrl: 'https://github.com/defunkt.png',
      createdAt: new Date(),
      githubUsername: 'defunkt',
      username: 'defunkt',
    });

    const leaderboard = this.server.create('leaderboard');

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user1,
      score: 96,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user2,
      score: 221,
    });
    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user3,
      score: 187,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user4,
      score: 142,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user5,
      score: 110,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user6,
      score: 99,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user7,
      score: 88,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user8,
      score: 77,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user9,
      score: 66,
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user10,
      score: 55,
    });

    await leaderboardPage.visit({ language_slug: 'rust' });
    assert.strictEqual(currentURL(), '/leaderboards/rust');

    await this.pauseTest();
  });
});
