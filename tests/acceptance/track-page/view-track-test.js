import createTrackLeaderboardEntries from 'codecrafters-frontend/mirage/utils/create-track-leaderboard-entries';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit, find, waitUntil, isSettled } from '@ember/test-helpers';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';

module('Acceptance | track-page | view-track', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);

    createTrackLeaderboardEntries(this.server, 'go', 'redis');
    createTrackLeaderboardEntries(this.server, 'rust', 'redis');

    const tcpOverviewConcept = createConceptFromFixture(this.server, tcpOverview);
    const networkProtocolsConcept = createConceptFromFixture(this.server, networkProtocols);

    const rustPrimerConceptGroup = this.server.create('concept-group', {
      author: this.server.schema.users.first(),
      description_markdown: 'Dummy description',
      concepts: [tcpOverviewConcept, networkProtocolsConcept],
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'rust-primer',
      title: 'Rust Primer',
    });

    const rust = this.server.schema.languages.findBy({ slug: 'rust' });
    rust.update({ primerConceptGroup: rustPrimerConceptGroup });
  });

  test('it renders for anonymous user', async function (assert) {
    await visit('/tracks/go');
    assert.false(trackPage.primerConceptGroupSection.isVisible, 'primer concept group section should be visible');

    await percySnapshot('Track - Anonymous User');

    await visit('/tracks/rust');
    assert.true(trackPage.primerConceptGroupSection.isVisible, 'primer concept group section should be visible');

    await percySnapshot('Track (With Primer) - Anonymous User');

    await visit('/tracks/haskell');
    assert.false(trackPage.primerConceptGroupSection.isVisible, 'primer concept group section should be visible');

    await percySnapshot('Track (Generic) - Anonymous User');
  });

  test('it renders in dark mode', async function (assert) {
    this.owner.lookup('service:dark-mode').isEnabledTemporarily = true;

    await visit('/tracks/go');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track - Anonymous User (Dark Mode)');
  });

  test('it renders the correct description for a track', async function (assert) {
    await visit('/tracks/python');

    assert.strictEqual(trackPage.header.descriptionText, "Python mastery exercises. Become your team's resident Python expert.");
  });

  test('it renders for logged-in user', async function (assert) {
    signIn(this.owner, this.server);

    await visit('/tracks/go');
    assert.strictEqual(1, 1); // dummy assertion

    await percySnapshot('Track - Not Started');
  });

  test('it renders for logged-in user who has started course', async function (assert) {
    signIn(this.owner, this.server);

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
    signIn(this.owner, this.server);

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
    signIn(this.owner, this.server);

    await trackPage.visit({ track_slug: 'javascript' });
    assert.notOk(trackPage.cards.map((item) => item.title).includes('Build your own React'));
  });

  test('it does not show a challenge if it is deprecated', async function (assert) {
    signIn(this.owner, this.server);

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
    assert.notOk(trackPage.cards.map((item) => item.title).includes('Build your own Docker'));
  });

  test('it does not show a challenge if it is private', async function (assert) {
    signIn(this.owner, this.server);

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    redis.update({ visibility: 'private' });

    await visit('/tracks/python');
    assert.notOk(trackPage.cards.map((item) => item.title).includes('Build your own Redis'), 'private course should not be included');
  });

  test('it does not show a challenge if it is private and user has repository', async function (assert) {
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    redis.update({ visibility: 'private' });

    this.server.create('repository', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await visit('/tracks/python');
    assert.notOk(trackPage.cards.map((item) => item.title).includes('Build your own Redis'), 'private course should not be included');
  });

  test('visiting from catalog page has no loading page', async function (assert) {
    let loadingIndicatorWasRendered = false;

    await catalogPage.visit();
    catalogPage.clickOnTrack('Rust');

    await waitUntil(() => {
      if (isSettled()) {
        return true;
      } else if (find('[data-test-loading]')) {
        loadingIndicatorWasRendered = true;
      }
    });

    assert.notOk(loadingIndicatorWasRendered, 'loading indicator was not rendered');
    assert.true(trackPage.primerConceptGroupSection.isVisible, 'primer concept group section should be visible');
    assert.strictEqual(trackPage.cards.length, 5, 'expected 5 track cards to be present (one per course)');
  });

  test('it sorts completed courses by most recent submission first', async function (assert) {
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    let git = this.server.schema.courses.findBy({ slug: 'git' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    dummy.update({ releaseStatus: 'live' });

    this.server.create('repository', 'withAllStagesCompleted', {
      course: git,
      language: go,
      user: currentUser,
      createdAt: new Date('2023-12-31'),
    });

    this.server.create('repository', 'withAllStagesCompleted', {
      course: dummy,
      language: go,
      user: currentUser,
      createdAt: new Date('2023-01-01'),
    });

    await visit('/tracks/go');

    let cardTitles = trackPage.cards.map((item) => item.title);
    let gitIndex = cardTitles.indexOf('Build your own Git →');
    let dummyIndex = cardTitles.indexOf('Build your own Dummy →');

    assert.ok(gitIndex < dummyIndex, 'completed courses should be sorted by most recent submission first');
  });

  test('it sorts in-progress courses by most recent submission first', async function (assert) {
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    let grep = this.server.schema.courses.findBy({ slug: 'grep' });
    let sqlite = this.server.schema.courses.findBy({ slug: 'sqlite' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: grep,
      language: go,
      user: currentUser,
      createdAt: new Date('2023-01-02'),
    });

    this.server.create('repository', 'withSecondStageCompleted', {
      course: sqlite,
      language: go,
      user: currentUser,
      createdAt: new Date('2023-01-01'),
    });

    await visit('/tracks/go');

    let cardTitles = trackPage.cards.map((item) => item.title);
    let grepIndex = cardTitles.indexOf('Build your own grep →');
    let sqliteIndex = cardTitles.indexOf('Build your own SQLite →');

    assert.ok(grepIndex < sqliteIndex, 'in-progress courses should be sorted by most recent submission first');
  });

  test('it sorts course priority groups correctly', async function (assert) {
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    let grep = this.server.schema.courses.findBy({ slug: 'grep' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    docker.update({ releaseStatus: 'live' });

    this.server.create('repository', 'withAllStagesCompleted', {
      course: dummy,
      language: go,
      user: currentUser,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: grep,
      language: go,
      user: currentUser,
    });

    await visit('/tracks/go');

    let cardTitles = trackPage.cards.map((item) => item.title);
    let dummyIndex = cardTitles.indexOf('Build your own Dummy →');
    let grepIndex = cardTitles.indexOf('Build your own grep →');
    let dockerIndex = cardTitles.indexOf('Build your own Docker →');

    assert.ok(dummyIndex < grepIndex, 'completed courses should come before in-progress courses');
    assert.ok(grepIndex < dockerIndex, 'in-progress courses should come before not-started courses');

    await percySnapshot('Track - Course Ordering');
  });
});
