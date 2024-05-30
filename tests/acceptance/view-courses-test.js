import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsStaff, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitFor, waitUntil, find, isSettled, settled } from '@ember/test-helpers';

module('Acceptance | view-courses', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'grep' });
    course.update({ releaseStatus: 'beta' });

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 5 course cards to be present');

    await percySnapshot('Catalog Page');

    assert.strictEqual(catalogPage.courseCards[0].name, 'Build your own Git');
    assert.strictEqual(catalogPage.courseCards[1].name, 'Build your own Redis');
    assert.strictEqual(catalogPage.courseCards[2].name, 'Build your own grep');
    assert.strictEqual(catalogPage.courseCards[3].name, 'Build your own Docker');
    assert.strictEqual(catalogPage.courseCards[4].name, 'Build your own SQLite');

    assert.ok(catalogPage.courseCardByName('Build your own grep').hasBetaLabel, 'beta challenges should have beta label');
    assert.notOk(catalogPage.courseCardByName('Build your own Redis').hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCardByName('Build your own Docker').hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCardByName('Build your own Git').hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCardByName('Build your own SQLite').hasBetaLabel, 'live challenges should not have beta label');
  });

  test('it renders alpha courses if user is staff', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 6, 'expected 6 course cards to be present');

    assert.ok(catalogPage.courseCards[5].hasAlphaLabel, 'alpha challenges should have alpha label');
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
    assert.strictEqual(catalogPage.courseCards[0].progressText, '1/44 stages');
    assert.strictEqual(catalogPage.courseCards[0].progressBarStyle, 'width:2%');
  });

  test('it renders with progress if user has created a repository', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();

    assert.strictEqual(catalogPage.courseCards[0].actionText, 'Resume');
    assert.true(catalogPage.courseCards[0].hasProgressBar);
    assert.strictEqual(catalogPage.courseCards[0].progressText, '0/44 stages');
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
    testScenario(this.server, ['dummy', 'sqlite']);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    this.server.create('repository', 'withAllStagesCompleted', {
      createdAt: new Date('2022-01-01'),
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 2, 'expected 2 course cards to be present');

    await percySnapshot('Courses Page - Course completed');

    assert.strictEqual(catalogPage.courseCards[0].name, 'Build your own Dummy');
    assert.strictEqual(catalogPage.courseCards[0].actionText, 'Start Again');
    assert.strictEqual(catalogPage.courseCards[1].actionText, 'Start');
  });

  test('it renders if user is not signed in', async function (assert) {
    testScenario(this.server);

    this.owner.unregister('service:date');
    this.owner.register('service:date', FakeDateService);

    let dateService = this.owner.lookup('service:date');
    let now = new Date('2024-01-01').getTime();
    dateService.setNow(now);

    let isFreeExpirationDate = new Date(dateService.now() + 20 * 24 * 60 * 60 * 1000);

    const grep = this.server.schema.courses.findBy({ slug: 'grep' });
    grep.update({ releaseStatus: 'beta' });

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    redis.update({ isFreeUntil: isFreeExpirationDate });

    await catalogPage.visit();
    assert.strictEqual(catalogPage.courseCards.length, 5, 'expected 5 course cards to be present');

    assert.strictEqual(catalogPage.courseCards[0].name, 'Build your own Git');
    assert.strictEqual(catalogPage.courseCards[1].name, 'Build your own Redis');
    assert.strictEqual(catalogPage.courseCards[2].name, 'Build your own grep');
    assert.strictEqual(catalogPage.courseCards[3].name, 'Build your own Docker');
    assert.strictEqual(catalogPage.courseCards[4].name, 'Build your own SQLite');

    assert.ok(catalogPage.courseCardByName('Build your own grep').hasBetaLabel, 'beta challenges should have beta label');
    assert.ok(catalogPage.courseCardByName('Build your own Redis').hasFreeLabel, 'free challenges should have free label');
    assert.notOk(catalogPage.courseCardByName('Build your own Docker').hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCardByName('Build your own Git').hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(catalogPage.courseCardByName('Build your own SQLite').hasBetaLabel, 'live challenges should not have beta label');
  });

  test('course card does not render free label if user has access to membership benefits', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    this.owner.unregister('service:date');
    this.owner.register('service:date', FakeDateService);

    let dateService = this.owner.lookup('service:date');
    let now = new Date('2024-01-01').getTime();
    dateService.setNow(now);

    let isFreeExpirationDate = new Date(dateService.now() + 20 * 24 * 60 * 60 * 1000);

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    redis.update({ isFreeUntil: isFreeExpirationDate });

    await catalogPage.visit();

    assert.notOk(catalogPage.courseCardByName('Build your own Redis').hasFreeLabel, 'free challenges should not have the free label if user has subscription');
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
