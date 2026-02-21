import ApiRequestsVerifier from 'codecrafters-frontend/tests/support/verify-api-requests';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';

module('Acceptance | course-page | attempt-course-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can fail course stage', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    const apiRequestsVerifier = new ApiRequestsVerifier(this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis/stages/rg2', 'current URL is course page URL');
    apiRequestsVerifier.clearPreviousRequests();

    assert.strictEqual(coursePage.header.stepName, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Ready to run tests...', 'footer text is waiting for git push');

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Tests failed.', 'footer text is tests failed');

    assert.ok(
      apiRequestsVerifier.verify([
        '/api/v1/repositories', // fetch repositories (course page)
      ]),
      'API requests match expected sequence after creating submission',
    );

    await percySnapshot('Course Page - Second stage failed');

    await coursePage.testRunnerCard.click();
    await percySnapshot('Test Runner Card - Failed tests');

    await coursePage.testRunnerCard.clickOnHideInstructionsButton();
  });

  test('can pass course stage', async function (assert) {
    testScenario(this.server);
    const currentUser = signInAsSubscriber(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    const go = this.server.schema.languages.findBy({ slug: 'go' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Ready to run tests...', 'footer text is waiting for git push');

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    assert.ok(coursePage.currentStepCompleteModal.languageLeaderboardRankSection.isVisible, 'language leaderboard rank section is visible');

    await coursePage.currentStepCompleteModal.clickOnCloseButton();
    await animationsSettled();
    assert.ok(coursePage.currentStepCompletePill.isVisible, 'current step complete pill is visible');
  });

  test('shows system-initiated evaluating message', async function (assert) {
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

    this.server.create('submission', 'withEvaluatingStatus', {
      repository: repository,
      clientType: 'system',
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(
      coursePage.testResultsBar.progressIndicatorText,
      'Checking next stage...',
      'footer text is checking next stage for system-initiated evaluating submission',
    );
  });

  test('shows system-initiated failure message', async function (assert) {
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
      clientType: 'system',
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(
      coursePage.testResultsBar.progressIndicatorText,
      'Ready to run tests',
      'footer text is ready to run tests for system-initiated failed submission',
    );
  });

  test('shows system-initiated success message', async function (assert) {
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
      clientType: 'system',
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(
      coursePage.testResultsBar.progressIndicatorText,
      'Next stage already implemented!',
      'footer text is next stage already implemented for system-initiated success submission',
    );
  });

  test('can pass tests using CLI', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Respond to PING', 'second stage is active');
    assert.ok(coursePage.testRunnerCard.isVisible, 'test runner card is visible');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      clientType: 'cli',
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    assert.notOk(coursePage.testRunnerCard.isVisible, 'test runner card is not visible');
    assert.ok(coursePage.testsPassedModal.isVisible, 'tests passed modal is visible');

    await coursePage.testsPassedModal.clickOnCloseButton();
    await animationsSettled();

    assert.notOk(coursePage.testsPassedModal.isVisible, 'tests passed modal is not visible after dismissal');
    assert.ok(coursePage.testsPassedPill.isVisible, 'tests passed pill is visible after dismissing modal');
    assert.ok(coursePage.testsPassedPill.proceedButton.isVisible, 'proceed button is visible in tests passed pill');

    await coursePage.testsPassedPill.click();
    await animationsSettled();

    assert.notOk(coursePage.testsPassedPill.isVisible, 'tests passed pill is not visible after clicking');
    assert.ok(coursePage.testsPassedModal.isVisible, 'tests passed modal is visible again after clicking pill');
  });
});
