import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visit } from '@ember/test-helpers';

module('Acceptance | view-track', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    let go = this.server.schema.languages.findBy({ name: 'Go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let user1 = this.server.create('user', {
      id: 'user1',
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'Gufran',
      username: 'Gufran',
    });

    let user2 = this.server.create('user', {
      id: 'user2',
      avatarUrl: 'https://github.com/rohitpaulk.png',
      createdAt: new Date(),
      githubUsername: 'rohitpaulk',
      username: 'rohitpaulk',
    });

    let user3 = this.server.create('user', {
      id: 'user3',
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    [user1, user2, user3].forEach((user) => {
      this.server.create('leaderboard-entry', {
        status: 'idle',
        currentCourseStage: redis.stages.models.find((x) => x.position === 2),
        language: go,
        user: user,
        lastAttemptAt: new Date(),
      });
    });

    await visit('/tracks/go');
    assert.equal(1, 1); // dummy assertion

    await visit('/tracks/haskell');
    assert.equal(1, 1); // dummy assertion
  });
});
