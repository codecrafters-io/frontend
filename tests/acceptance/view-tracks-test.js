import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitFor, waitUntil, find, isSettled, settled } from '@ember/test-helpers';

module('Acceptance | view-tracks', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    assert.strictEqual(catalogPage.trackCards.length, 20, 'expected 20 track cards to be present');

    await percySnapshot('Tracks Page');

    assert.ok(catalogPage.trackCards[0].hasPopularLabel, 'go should have popular label');
    assert.ok(catalogPage.trackCards[1].hasPopularLabel, 'rust should have popular label');
    assert.ok(catalogPage.trackCards[2].hasPopularLabel, 'python should have popular label');
    assert.notOk(catalogPage.trackCards[3].hasPopularLabel, 'other tracks should not have popular label');
    assert.notOk(catalogPage.trackCards[4].hasPopularLabel, 'other tracks should not have popular label');
  });

  test('it renders with progress if user has started a course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();

    assert.strictEqual(catalogPage.trackCards[0].actionText, 'Resume', 'expected first track to have resume action');
    assert.strictEqual(catalogPage.trackCards[1].actionText, 'Start', 'expected second track to have start action');
    assert.strictEqual(catalogPage.trackCards[2].actionText, 'Start', 'expected third track to have start action');
    assert.strictEqual(catalogPage.trackCards[3].actionText, 'Start', 'expected fourth track to have start action');

    assert.true(catalogPage.trackCards[0].hasProgressBar, 'expected first track to have progress bar');
    assert.strictEqual(catalogPage.trackCards[0].progressText, '1/123 stages');
    assert.strictEqual(catalogPage.trackCards[0].progressBarStyle, 'width:1%');
  });

  test('it sorts course cards based on last push', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      createdAt: new Date('2022-01-01'),
      course: redis,
      language: go,
      user: currentUser,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      createdAt: new Date('2022-02-02'),
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();

    await percySnapshot('Tracks Page - Tracks in progress');

    assert.strictEqual(catalogPage.trackCards[0].name, 'Go');
    assert.strictEqual(catalogPage.trackCards[0].actionText, 'Resume');
    assert.strictEqual(catalogPage.trackCards[1].name, 'Python');
    assert.strictEqual(catalogPage.trackCards[1].actionText, 'Resume');
    assert.strictEqual(catalogPage.trackCards[2].actionText, 'Start');
    assert.strictEqual(catalogPage.trackCards[3].actionText, 'Start');
  });

  test('it renders completed track cards', async function (assert) {
    testScenario(this.server, ['dummy', 'sqlite']);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    const dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    const sqlite = this.server.schema.courses.findBy({ slug: 'sqlite' });

    dummy.update({ releaseStatus: 'live' });

    this.server.create('repository', 'withAllStagesCompleted', {
      createdAt: new Date('2022-01-01'),
      course: dummy,
      language: go,
      user: currentUser,
    });

    this.server.create('repository', 'withAllStagesCompleted', {
      createdAt: new Date('2022-02-02'),
      course: sqlite,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();

    await percySnapshot('Tracks Page - Track completed');

    assert.strictEqual(catalogPage.trackCards[0].name, 'Go');
    assert.strictEqual(catalogPage.trackCards[0].actionText, 'Resume');
    assert.strictEqual(catalogPage.trackCards[1].actionText, 'Start');
    assert.strictEqual(catalogPage.trackCards[2].actionText, 'Start');
    assert.strictEqual(catalogPage.trackCards[3].actionText, 'Start');
    assert.strictEqual(catalogPage.trackCards[0].progressText, '15/15 stages');
    assert.strictEqual(catalogPage.trackCards[0].progressBarStyle, 'width:100%');
  });

  test('it renders if user is not signed in', async function (assert) {
    testScenario(this.server);

    await catalogPage.visit();
    assert.strictEqual(catalogPage.trackCards.length, 20, 'expected 20 track cards to be present');

    assert.strictEqual(catalogPage.trackCards[0].name, 'Rust');
    assert.strictEqual(catalogPage.trackCards[1].name, 'Go');
    assert.strictEqual(catalogPage.trackCards[2].name, 'Python');
  });

  test('first time visit has loading page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    catalogPage.visit();
    await waitFor('[data-test-loading]');

    assert.ok(find('[data-test-loading]'), 'loader should be present');
    await settled();
    assert.strictEqual(catalogPage.trackCards.length, 20, 'expected 20 track cards to be present');
  });

  test('second time visit with local repository data has no loading page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnTrack('Go');
    catalogPage.visit();

    let loadingIndicatorWasRendered;

    await waitUntil(() => {
      if (isSettled()) {
        return true;
      } else if (find('[data-test-loading]')) {
        loadingIndicatorWasRendered = true;
      }
    });

    assert.notOk(loadingIndicatorWasRendered, 'loading indicator was not rendered');
    assert.strictEqual(catalogPage.trackCards.length, 20, 'expected 20 track cards to be present');
  });

  test('second time visit without local repository data has no loading page ', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnTrack('Go');
    catalogPage.visit();

    let loadingIndicatorWasRendered;

    await waitUntil(() => {
      if (isSettled()) {
        return true;
      } else if (find('[data-test-loading]')) {
        loadingIndicatorWasRendered = true;
      }
    });

    assert.notOk(loadingIndicatorWasRendered, 'loading indicator was not rendered');
    assert.strictEqual(catalogPage.trackCards.length, 20, 'expected 20 track cards to be present');
  });

  test('deprecated challenges do not count towards the number of stages on a language card', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const docker = this.server.schema.courses.findBy({ slug: 'docker' });
    docker.update({ releaseStatus: 'deprecated' });

    await catalogPage.visit();

    assert.ok(catalogPage.trackCards[0].hasPopularLabel, 'go should have popular label');
    assert.ok(catalogPage.trackCards[0].text.includes('117 stages'), 'number of stages should not include deprecated stages count');
  });
});
