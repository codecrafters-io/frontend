import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | start-course', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can start course', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');

    let baseRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'fetch leaderboard entries (course overview page)',
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
      'fetch languages (request language button)',
      'fetch course language requests (request language button)',
    ].length;

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount, `expected ${baseRequestsCount} requests`);

    await percySnapshot('Start Course - Select Language');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.strictEqual(coursePage.setupItem.footerText, 'Select a language to proceed', 'footer text is select language to proceed');

    await coursePage.setupItem.clickOnLanguageButton('JavaScript');

    baseRequestsCount += 2; // For some reason, we're rendering the "Request Other" button again when a language is chosen.

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 1, 'create repository request was executed');

    await percySnapshot('Start Course - Clone Repository');

    assert.ok(coursePage.setupItem.isOnCloneRepositoryStep, 'current step is clone repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.strictEqual(coursePage.setupItem.footerText, 'Listening for a git push...', 'footer text is listening for git push');

    assert.strictEqual(
      coursePage.setupItem.copyableCloneRepositoryInstructions,
      'git clone https://git.codecraters.io/a-long-test-string.git codecrafters-redis-javascript && cd codecrafters-redis-javascript',
      'clone repository instructions are correct'
    );

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 3, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is still in-progress');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 5, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsComplete, 'current status is complete');
    assert.strictEqual(coursePage.setupItem.footerText, 'Git push received.', 'footer text is git push received');

    await percySnapshot('Start Course - Git Push Received');

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await new Promise((resolve) => setTimeout(resolve, 101)); // Wait for auto-advance
    await animationsSettled();

    assert.notOk(coursePage.setupItemIsActive, 'setup item is collapsed');
    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is visible');

    assert.ok(coursePage.activeCourseStageItem.stageInstructionsText.startsWith('CodeCrafters runs tests'), 'Instructions prelude must be present');

    await percySnapshot('Start Course - Waiting For Second Push');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });

  // We don't restrict repository creation anymore
  test.skip('non-subscriber cannot start course if paid', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.strictEqual(coursePage.setupItem.footerText, 'Select a language to proceed', 'footer text is select language to proceed');

    await coursePage.setupItem.clickOnLanguageButton('JavaScript');
    assert.strictEqual(coursePage.setupItem.footerText, 'Daily limit reached.');

    await percySnapshot('Start Course - No Subscription');

    await animationsSettled();
  });

  test('can start repo and abandon halfway (regression)', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.setupItem.clickOnLanguageButton('Python');
    assert.contains(currentURL(), '/courses/redis?repo=', 'current URL includes repo ID');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await coursePage.header.clickOnHeaderLink('Catalog');
    await catalogPage.clickOnTrack('Python');
    await trackPage.clickOnCourseCard('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis?track=python', 'current URL is changed to not include invalid repo');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    await coursePage.setupItem.clickOnLanguageButton('Python');
    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });
});
