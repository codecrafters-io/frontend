import createTrackLeaderboardEntries from 'codecrafters-frontend/mirage/utils/create-track-leaderboard-entries';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit } from '@ember/test-helpers';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';

module('Acceptance | track-page | view-track', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');
    createTrackLeaderboardEntries(this.server, 'rust', 'redis');

    createConceptFromFixture(this.server, tcpOverview);
    createConceptFromFixture(this.server, networkProtocols);

    this.server.create('concept-group', {
      author: this.server.schema.users.first(),
      description_markdown: 'Dummy description',
      concept_slugs: ['tcp-overview', 'network-protocols', 'tcp-overview', 'network-protocols', 'tcp-overview', 'network-protocols'],
      slug: 'rust-primer',
      title: 'Rust Primer',
    });

    await visit('/tracks/go');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track - Anonymous User');

    await visit('/tracks/rust');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track (With Primer) - Anonymous User');

    await visit('/tracks/haskell');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track (Generic) - Anonymous User');
  });

  test('it renders in dark mode', async function (assert) {
    testScenario(this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    this.owner.lookup('service:dark-mode').isEnabledTemporarily = true;

    await visit('/tracks/go');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track - Anonymous User (Dark Mode)');
  });

  test('it renders the correct description for a track', async function (assert) {
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
    testScenario(this.server, ['dummy', 'sqlite']);
    signIn(this.owner, this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'dummy');

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withAllStagesCompleted', {
      course: dummy,
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

  test('it does not show a challenge if it is deprecated', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);
    createTrackLeaderboardEntries(this.server, 'go', 'redis');

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });
    docker.update({ releaseStatus: 'deprecated' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      user: currentUser,
    });

    await visit('/tracks/go');
    assert.notOk(trackPage.cards.mapBy('title').includes('Build your own Docker'));
  });
});
