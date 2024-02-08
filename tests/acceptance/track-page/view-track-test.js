import createTrackLeaderboardEntries from 'codecrafters-frontend/mirage/utils/create-track-leaderboard-entries';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit } from '@ember/test-helpers';

module('Acceptance | view-track', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    await visit('/tracks/go');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track - Anonymous User');

    await visit('/tracks/haskell');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track (Generic) - Anonymous User');
  });

  test('it renders the correct description if the track is Go', async function (assert) {
    testScenario(this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    await visit('/tracks/go');

    assert.strictEqual(
      trackPage.header.descriptionText,
      'Achieve mastery in advanced Go, by building real-world projects. Featuring goroutines, systems programming, file I/O, and more.',
    );
  });

  test('it renders the correct description if the track is not Go', async function (assert) {
    testScenario(this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    await visit('/tracks/python');

    assert.strictEqual(trackPage.header.descriptionText, "Python mastery exercises. Become your team's resident Python expert.");
  });

  test('it renders for logged-in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    await visit('/tracks/go');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track - Not Started');
  });

  test('it renders for logged-in user who has started course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await visit('/tracks/go');
    assert.strictEqual(1, 1);

    await percySnapshot('Track - Started');
  });

  test('it renders for logged-in user who has finished one course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withAllStagesCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await visit('/tracks/go');
    assert.strictEqual(1, 1);

    await percySnapshot('Track - 1 Course Finished');
  });

  test('it excludes alpha courses', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await trackPage.visit({ track_slug: 'javascript' });
    assert.notOk(trackPage.cards.mapBy('title').includes('Build your own React'));
  });
});
