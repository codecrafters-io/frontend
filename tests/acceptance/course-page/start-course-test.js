import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import tracksPage from 'codecrafters-frontend/tests/pages/tracks-page';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import percySnapshot from '@percy/ember';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | start-course-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can start course', async function (assert) {
    signIn(this.owner, this.server);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.equal(currentURL(), '/courses/redis', 'current URL is course page URL');

    let baseRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'notify page view (courses listing page)',
      'fetch leaderboard entries (course overview page)',
      'notify page view (course overview page)',
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
      'fetch languages (request language button)',
      'fetch course language requests (request language button)',
      'notify page view (course page)',
    ].length;

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount);

    await percySnapshot('Start Course - Select Language');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.equal(coursePage.setupItem.footerText, 'Select a language to proceed', 'footer text is select language to proceed');

    await coursePage.setupItem.clickOnLanguageButton('JavaScript');

    baseRequestsCount += 2; // For some reason, we're rendering the "Request Other" button again when a language is chosen.

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 1, 'create repository request was executed');

    await percySnapshot('Start Course - Clone Repository');

    assert.ok(coursePage.setupItem.isOnCloneRepositoryStep, 'current step is clone repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.equal(coursePage.setupItem.footerText, 'Listening for a git push...');

    assert.equal(
      coursePage.setupItem.copyableCloneRepositoryInstructions,
      'git clone https://git.codecraters.io/a-long-test-string.git codecrafters-redis-javascript && cd codecrafters-redis-javascript'
    );

    await this.clock.tick(2001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 2, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is still in-progress');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    await this.clock.tick(2001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 3, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsComplete, 'current status is complete');
    assert.equal(coursePage.setupItem.footerText, 'Git push received.');

    await percySnapshot('Start Course - Git Push Received');

    await this.clock.tick(2001);
    await animationsSettled();

    assert.notOk(coursePage.setupItemIsActive, 'setup item is collapsed');
    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is visible');

    assert.ok(coursePage.activeCourseStageItem.stageInstructionsText.startsWith('CodeCrafters runs tests'), 'Instructions prelude must be present');

    await percySnapshot('Start Course - Waiting For Second Push');

    await coursePage.repositoryDropdown.click();
    assert.equal(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });

  test('can start repo and abandon halfway (regression)', async function (assert) {
    signIn(this.owner, this.server);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.setupItem.clickOnLanguageButton('Python');
    assert.contains(currentURL(), '/courses/redis?repo=', 'current URL includes repo ID');

    await coursePage.repositoryDropdown.click();
    assert.equal(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await coursePage.header.clickOnTracksLink();
    await tracksPage.clickOnTrack('Python');
    await trackPage.clickOnCourseCard('Build your own Redis');

    assert.equal(currentURL(), '/courses/redis?fresh=false&track=python', 'current URL is changed to not include invalid repo');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    await coursePage.setupItem.clickOnLanguageButton('Python');
    await coursePage.repositoryDropdown.click();
    assert.equal(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });
});
