import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { triggerKeyEvent, waitUntil } from '@ember/test-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

module('Acceptance | course-page | view-test-results', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view test results bar when no repository is present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    assert.notOk(coursePage.testResultsBar.logsPreview.isPresent);

    await percySnapshot('Course Page - View test results - No repository');
  });

  test('can view test results bar when tests are running', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withEvaluatingStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[0],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    assert.ok(coursePage.testResultsBar.logsPreview.isPresent);
    assert.strictEqual(coursePage.testResultsBar.logsPreview.text, 'Running tests... (view `git push` output for live logs)');

    await percySnapshot('Course Page - View test results - Tests running');
  });

  test('can view test results when last submission failed', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    await waitUntil(() => coursePage.testResultsBar.logsPreview.logs !== ''); // Logs are fetched on-demand
    assert.contains(coursePage.testResultsBar.logsPreview.logs, '[stage-1] failure\n[stage-2] failure');

    await percySnapshot('Course Page - View test results - Failure');
  });

  test('can view test results when last submission passed', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      clientType: 'cli',
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    await waitUntil(() => coursePage.testResultsBar.logsPreview.logs !== ''); // Logs are fetched on-demand
    assert.strictEqual(coursePage.testResultsBar.logsPreview.logs, '[stage-1] passed\n[stage-2] passed');

    await percySnapshot('Course Page - View test results - Success');
  });

  test('can toggle test results bar with CMD+J keyboard shortcut', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    // Initially collapsed
    assert.strictEqual(coursePage.testResultsBar.contents.height, 0, 'Test results bar should be collapsed initially');

    // Press CMD+J to expand
    await triggerKeyEvent(document, 'keydown', 'KeyJ', { metaKey: true });
    assert.ok(coursePage.testResultsBar.contents.height > 0, 'Test results bar should be expanded after CMD+J');

    // Press CMD+J again to collapse
    await triggerKeyEvent(document, 'keydown', 'KeyJ', { metaKey: true });
    assert.strictEqual(coursePage.testResultsBar.contents.height, 0, 'Test results bar should be collapsed after second CMD+J');
  });
});
