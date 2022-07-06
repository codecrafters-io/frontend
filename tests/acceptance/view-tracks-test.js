import tracksPage from 'codecrafters-frontend/tests/pages/tracks-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitFor, waitUntil, find, isSettled, settled } from '@ember/test-helpers';

module('Acceptance | view-tracks', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await tracksPage.visit();
    assert.equal(tracksPage.trackCards.length, 14, 'expected 14 course cards to be present');

    await percySnapshot('Tracks Page');

    assert.notOk(tracksPage.trackCards[0].hasBetaLabel, 'go should not have beta label');
    assert.ok(tracksPage.trackCards[1].hasBetaLabel, 'other tracks should have beta label');
    assert.ok(tracksPage.trackCards[2].hasBetaLabel, 'other tracks should have beta label');
    assert.ok(tracksPage.trackCards[3].hasBetaLabel, 'other tracks should have beta label');
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

    await tracksPage.visit();

    assert.equal(tracksPage.trackCards[0].actionText, 'Resume');
    assert.equal(tracksPage.trackCards[1].actionText, 'Start');
    assert.equal(tracksPage.trackCards[2].actionText, 'Start');
    assert.equal(tracksPage.trackCards[3].actionText, 'Start');

    assert.true(tracksPage.trackCards[0].hasProgressBar);
    assert.false(tracksPage.trackCards[0].hasDifficultyLabel);
    assert.equal(tracksPage.trackCards[0].progressText, '1/28 stages');
    assert.equal(tracksPage.trackCards[0].progressBarStyle, 'width:4%');
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

    await tracksPage.visit();

    await percySnapshot('Tracks Page - Tracks in progress');

    assert.equal(tracksPage.trackCards[0].name, 'Go');
    assert.equal(tracksPage.trackCards[0].actionText, 'Resume');
    assert.equal(tracksPage.trackCards[1].name, 'Python');
    assert.equal(tracksPage.trackCards[1].actionText, 'Resume');
    assert.equal(tracksPage.trackCards[2].actionText, 'Start');
    assert.equal(tracksPage.trackCards[3].actionText, 'Start');
  });

  test('it renders completed track cards', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    this.server.schema.courses.all().models.forEach((course) => {
      if (course.supportedLanguages.models.map((language) => language.slug).includes(go.slug)) {
        this.server.create('repository', 'withAllStagesCompleted', {
          createdAt: new Date('2022-01-01'),
          course: course,
          language: go,
          user: currentUser,
        });
      }
    });

    await tracksPage.visit();

    await percySnapshot('Tracks Page - Track completed');

    assert.equal(tracksPage.trackCards[0].name, 'Go');
    assert.equal(tracksPage.trackCards[0].actionText, 'Resume');
    assert.equal(tracksPage.trackCards[1].actionText, 'Start');
    assert.equal(tracksPage.trackCards[2].actionText, 'Start');
    assert.equal(tracksPage.trackCards[3].actionText, 'Start');

    assert.equal(tracksPage.trackCards[0].progressText, '28/28 stages');
    assert.equal(tracksPage.trackCards[0].progressBarStyle, 'width:100%');
  });

  test('it renders if user is not signed in', async function (assert) {
    testScenario(this.server);

    await tracksPage.visit();
    assert.equal(tracksPage.trackCards.length, 14, 'expected 14 track cards to be present');
  });

  test('first time visit has loading page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    tracksPage.visit();
    await waitFor('[data-test-loading]');

    assert.ok(find('[data-test-loading]'), 'loader should be present');
    await settled();
    assert.equal(tracksPage.trackCards.length, 14, 'expected 4 track cards to be present');
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

    await tracksPage.visit();
    await tracksPage.clickOnTrack('Go');
    tracksPage.visit();

    let loadingIndicatorWasRendered;

    await waitUntil(() => {
      if (isSettled()) {
        return true;
      } else if (find('[data-test-loading]')) {
        loadingIndicatorWasRendered = true;
      }
    });

    assert.notOk(loadingIndicatorWasRendered, 'loading indicator was not rendered');
    assert.equal(tracksPage.trackCards.length, 14, 'expected 14 track cards to be present');
  });

  test('second time visit without local repository data has no loading page ', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await tracksPage.visit();
    await tracksPage.clickOnTrack('Go');
    tracksPage.visit();

    let loadingIndicatorWasRendered;

    await waitUntil(() => {
      if (isSettled()) {
        return true;
      } else if (find('[data-test-loading]')) {
        loadingIndicatorWasRendered = true;
      }
    });

    assert.notOk(loadingIndicatorWasRendered, 'loading indicator was not rendered');
    assert.equal(tracksPage.trackCards.length, 14, 'expected 14 track cards to be present');
  });
});
