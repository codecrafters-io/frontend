import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

module('Acceptance | course-page | share-progress', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('share progress button is visible after completing the second stage', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    // TODO: See if there's a way to get the "share progress" flow onto the current step complete modal instead?
    await coursePage.currentStepCompleteModal.clickOnViewInstructionsButton();

    assert.ok(coursePage.completedStepNotice.shareProgressButton.isVisible, 'completed step notice is visible if completed stage is not first stage');
  });

  test('share progress modal has the correct rendered content', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.notOk(coursePage.shareProgressModal.isVisible, 'progress banner modal is not visible');

    // TODO: See if there's a way to get the "share progress" flow onto the current step complete modal instead?
    await coursePage.currentStepCompleteModal.clickOnViewInstructionsButton();

    await coursePage.completedStepNotice.shareProgressButton.click();
    assert.ok(coursePage.shareProgressModal.isVisible, 'progress banner modal is visible');

    assert.contains(
      coursePage.shareProgressModal.copyableText.value,
      "I'm working on the @codecraftersio Build your own Redis challenge in Go.",
      'correct copyable text is shown',
    );

    assert.contains(
      coursePage.shareProgressModal.copyableText.value,
      'https://app.codecrafters.io/courses/redis/overview',
      'correct link in copyable text is shown',
    );

    await coursePage.shareProgressModal.socialPlatformIcons[1].click();

    assert.contains(
      coursePage.shareProgressModal.copyableText.value,
      "I'm working on the CodeCrafters Build your own Redis challenge in Go.",
      'correct copyable text is shown',
    );
  });

  test('progress banner and share progress modal analytics events are tracked', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    // TODO: See if there's a way to get the "share progress" flow onto the current step complete modal instead?
    await coursePage.currentStepCompleteModal.clickOnViewInstructionsButton();

    await coursePage.completedStepNotice.shareProgressButton.click();
    await coursePage.shareProgressModal.clickOnCopyButton();

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('copied_share_progress_text'), 'copied_share_progress_text event should be tracked');
    assert.ok(filteredAnalyticsEventsNames.includes('initiated_share_progress_flow'), 'initiated_share_progress_flow event should be tracked');
  });
});
