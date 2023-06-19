import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitFor, waitUntil, find, isSettled, settled } from '@ember/test-helpers';

module('Acceptance | view-courses', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 5 course cards to be present');

    await percySnapshot('Courses Page');

    assert.notOk(catalogPage.courseCards[0].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCards[1].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCards[2].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCards[3].hasBetaLabel, 'live challenges should not have beta label');
    assert.ok(catalogPage.courseCards[4].hasBetaLabel, 'live challenges should have beta label');
  });

  test('it renders alpha courses if user is staff', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 6, 'expected 6 course cards to be present');

    assert.ok(catalogPage.courseCards[4].hasAlphaLabel, 'alpha challenges should have alpha label');
  });

  test('it renders with progress if user has started a course', async function (assert) {
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
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 4 course cards to be present');

    assert.strictEqual(catalogPage.courseCards[0].actionText, 'Resume');
    assert.strictEqual(catalogPage.courseCards[1].actionText, 'Start');
    assert.strictEqual(catalogPage.courseCards[2].actionText, 'Start');
    assert.strictEqual(catalogPage.courseCards[3].actionText, 'Start');

    assert.true(catalogPage.courseCards[0].hasProgressBar);
    assert.false(catalogPage.courseCards[0].hasDifficultyLabel);
    assert.strictEqual(catalogPage.courseCards[0].progressText, '1/7 stages');
    assert.strictEqual(catalogPage.courseCards[0].progressBarStyle, 'width:14%');
  });

  test('it sorts course cards based on last push', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let git = this.server.schema.courses.findBy({ slug: 'git' });

    this.server.create('repository', 'withFirstStageCompleted', {
      createdAt: new Date('2022-01-01'),
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      createdAt: new Date('2022-02-02'),
      course: git,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 4 course cards to be present');

    await percySnapshot('Courses Page - Courses in progress');

    assert.strictEqual(catalogPage.courseCards[0].name, 'Build your own Git');
    assert.strictEqual(catalogPage.courseCards[0].actionText, 'Resume');
    assert.strictEqual(catalogPage.courseCards[1].name, 'Build your own Redis');
    assert.strictEqual(catalogPage.courseCards[1].actionText, 'Resume');
    assert.strictEqual(catalogPage.courseCards[2].actionText, 'Start');
    assert.strictEqual(catalogPage.courseCards[3].actionText, 'Start');
  });

  test('it renders completed course cards', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withAllStagesCompleted', {
      createdAt: new Date('2022-01-01'),
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 4 course cards to be present');

    await percySnapshot('Courses Page - Course completed');

    assert.strictEqual(catalogPage.courseCards[0].name, 'Build your own Redis');
    assert.strictEqual(catalogPage.courseCards[0].actionText, 'Start Again');
    assert.strictEqual(catalogPage.courseCards[1].actionText, 'Start');
    assert.strictEqual(catalogPage.courseCards[2].actionText, 'Start');
    assert.strictEqual(catalogPage.courseCards[3].actionText, 'Start');
  });

  test('it renders if user is not signed in', async function (assert) {
    testScenario(this.server);

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 4 course cards to be present');

    assert.notOk(catalogPage.courseCards[0].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCards[1].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCards[2].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCards[3].hasBetaLabel, 'live challenges should not have beta label');
    assert.ok(catalogPage.courseCards[4].hasBetaLabel, 'live challenges should not have beta label');
  });

  test('first time visit has loading page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    catalogPage.visit();
    await waitFor('[data-test-loading]');

    assert.ok(find('[data-test-loading]'), 'loader should be present');
    await settled();
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 4 course cards to be present');
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
    await catalogPage.clickOnCourse('Build your own Redis');
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
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 4 course cards to be present');
  });

  test('second time visit without local repository data has no loading page ', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
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
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 4 course cards to be present');
  });
});
