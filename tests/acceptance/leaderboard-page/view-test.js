import { currentURL } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import leaderboardPage from 'codecrafters-frontend/tests/pages/leaderboard-page';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { module, test } from 'qunit';
import percySnapshot from '@percy/ember';

module('Acceptance | leaderboard-page | view', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);

    for (const language of this.server.schema.languages.all().models) {
      language.update({ leaderboard: this.server.create('leaderboard', { highestPossibleScore: 237 }) });
    }
  });

  test('can view', async function (assert) {
    const user9 = signInAsStaff(this.owner, this.server);

    const language = this.server.schema.languages.all().models.find((language) => language.slug === 'rust');
    const leaderboard = language.leaderboard;

    const user1 = this.server.create('user', {
      id: 'user-1',
      avatarUrl: 'https://github.com/Gufran.png',
      username: 'Gufran',
    });

    const user2 = this.server.create('user', {
      id: 'user-2',
      avatarUrl: 'https://github.com/torvalds.png',
      username: 'torvalds',
    });

    const user3 = this.server.create('user', {
      id: 'user-3',
      avatarUrl: 'https://github.com/addyosmani.png',
      username: 'addyosmaniveryverylongusername-with-lots-of-characters',
    });

    const user4 = this.server.create('user', {
      id: 'user-4',
      avatarUrl: 'https://github.com/gaearon.png',
      username: 'gaearon',
    });

    const user5 = this.server.create('user', {
      id: 'user-5',
      avatarUrl: 'https://github.com/yyx990803.png',
      username: 'yyx990803',
    });

    const user6 = this.server.create('user', {
      id: 'user-6',
      avatarUrl: 'https://github.com/getify.png',
      username: 'getify',
    });

    const user7 = this.server.create('user', {
      id: 'user-7',
      avatarUrl: 'https://github.com/rauchg.png',
      username: 'rauchg',
    });

    const user8 = this.server.create('user', {
      id: 'user-8',
      avatarUrl: 'https://github.com/addyosmani.png',
      username: 'addyosmani',
    });

    const user10 = this.server.create('user', {
      id: 'user-10',
      avatarUrl: 'https://github.com/defunkt.png',
      username: 'defunkt',
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user1,
      score: 96,
      scoreUpdatesCount: 7,
      relatedCourseSlugs: ['redis', 'shell', 'sqlite', 'grep'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user2,
      score: 221,
      scoreUpdatesCount: 19,
      relatedCourseSlugs: ['redis', 'sqlite', 'grep'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user3,
      score: 187,
      scoreUpdatesCount: 18,
      relatedCourseSlugs: ['redis', 'shell'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user4,
      score: 142,
      scoreUpdatesCount: 17,
      relatedCourseSlugs: ['redis', 'shell'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user5,
      score: 110,
      scoreUpdatesCount: 16,
      relatedCourseSlugs: ['redis', 'shell'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user6,
      score: 99,
      scoreUpdatesCount: 15,
      relatedCourseSlugs: ['redis', 'shell'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user7,
      score: 88,
      scoreUpdatesCount: 14,
      relatedCourseSlugs: ['redis', 'shell'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user8,
      score: 77,
      scoreUpdatesCount: 13,
      relatedCourseSlugs: ['redis', 'shell'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user9,
      score: 66,
      scoreUpdatesCount: 12,
      relatedCourseSlugs: ['redis', 'git'],
    });

    this.server.create('leaderboard-entry', {
      leaderboard,
      user: user10,
      score: 55,
      scoreUpdatesCount: 4,
      relatedCourseSlugs: ['redis', 'shell'],
    });

    await leaderboardPage.visit({ language_slug: 'rust' });
    assert.strictEqual(currentURL(), '/leaderboards/rust');

    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 10, '10 entries should be shown');
    await percySnapshot('Leaderboard Page');
  });
});
