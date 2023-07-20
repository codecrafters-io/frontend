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
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

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

    assert.strictEqual(currentURL(), '/courses/redis/setup', 'current URL is course page URL');

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

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Repository Setup', 'step name is repository setup');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Select a language to proceed', 'footer text is select language to proceed');
    // assert.ok(coursePage.desktopHeader.statusIsInProgress, 'current status is in-progress');

    await coursePage.repositorySetupCard.clickOnLanguageButton('JavaScript');

    baseRequestsCount += 2; // For some reason, we're rendering the "Request Other" button again when a language is chosen.

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 1, 'create repository request was executed');

    await percySnapshot('Start Course - Clone Repository');

    assert.ok(coursePage.repositorySetupCard.isOnCloneRepositoryStep, 'current step is clone repository step');
    assert.strictEqual(coursePage.repositorySetupCard.footerText, 'Listening for a git push...', 'footer text is listening for git push');

    assert.strictEqual(
      coursePage.repositorySetupCard.copyableCloneRepositoryInstructions,
      'git clone https://git.codecraters.io/a-long-test-string.git codecrafters-redis-javascript && cd codecrafters-redis-javascript',
      'copyable clone repository instructions are correct',
    );

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 3, 'poll request was executed');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Listening for a git push...', 'progress text is listening for git push');
    assert.notOk(coursePage.repositorySetupCard.continueButton.isVisible, 'continue button is not visible');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 5, 'poll request was executed');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Git push received.', 'progress text is git push received');
    assert.ok(coursePage.repositorySetupCard.continueButton.isVisible, 'continue button is visible');

    await percySnapshot('Start Course - Git Push Received');

    await coursePage.repositorySetupCard.continueButton.click();
    assert.strictEqual(currentURL(), '/courses/redis/stages/1?repo=1', 'current URL is course page URL');

    await percySnapshot('Start Course - Waiting For Second Push', {
      percyCss: '[data-test-course-page-scrollable-area] { overflow-y: visible !important; }',
    });

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });

  // TODO handle this better
  skip('can start repo and abandon halfway (regression)', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.repositorySetupCard.clickOnLanguageButton('Python');
    assert.contains(currentURL(), '/courses/redis?repo=', 'current URL includes repo ID');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await coursePage.header.clickOnHeaderLink('Catalog');
    await catalogPage.clickOnTrack('Python');
    await trackPage.clickOnCourseCard('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis?track=python', 'current URL is changed to not include invalid repo');

    assert.ok(coursePage.repositorySetupCard.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.repositorySetupCard.statusIsInProgress, 'current status is in-progress');

    await coursePage.repositorySetupCard.clickOnLanguageButton('Python');
    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });
});
