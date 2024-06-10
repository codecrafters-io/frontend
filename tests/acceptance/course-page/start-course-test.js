import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { assertTooltipContent, assertTooltipNotRendered } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | start-course', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can start course', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/introduction', 'current URL is course page URL');

    let baseRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'fetch leaderboard entries (course overview page)',
      'refresh course (course overview page)',
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
      'fetch languages (request language button)',
      'fetch course language requests (request language button)',
    ].length;

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount, `expected ${baseRequestsCount} requests`);

    await percySnapshot('Start Course - Select Language');

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Introduction', 'step name is introduction');
    assert.strictEqual(coursePage.createRepositoryCard.expandedSectionTitle, 'Preferred Language', 'current section title is preferred language');

    assert.strictEqual(
      coursePage.desktopHeader.progressIndicatorText,
      'Select a language to proceed',
      'progress indicator says select language to proceed',
    );

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();

    baseRequestsCount += 2; // For some reason, we're rendering the "Request Other" button again when a language is chosen.
    baseRequestsCount += 1; // An extra request for leaderboard-entries started happening after ember-data upgrade

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 1, 'create repository request was executed');

    assert.strictEqual(coursePage.createRepositoryCard.expandedSectionTitle, 'Language Proficiency', 'current section title is language proficiency');
    await percySnapshot('Start Course - Select Language Proficiency');

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 3, 'poll request was executed');

    assert.notOk(coursePage.createRepositoryCard.continueButton.isVisible, 'continue button is not visible');

    await coursePage.createRepositoryCard.clickOnOptionButton('Beginner');
    await percySnapshot('Start Course - Language Proficiency Selected');

    await coursePage.createRepositoryCard.clickOnNextQuestionButton();
    await animationsSettled();

    assert.strictEqual(coursePage.createRepositoryCard.expandedSectionTitle, 'Practice Cadence', 'current section title is practice cadence');
    await percySnapshot('Start Course - Select Practice Cadence');

    await coursePage.createRepositoryCard.clickOnOptionButton('Every day');
    await animationsSettled();

    assert.strictEqual(coursePage.createRepositoryCard.expandedSectionTitle, 'Accountability', 'current section title is accountability');
    await percySnapshot('Start Course - Accountability');
    await coursePage.createRepositoryCard.clickOnOptionButton('Yes please');
    await coursePage.createRepositoryCard.clickOnContinueButton();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Repository Setup', 'step name is repository setup');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Listening for a git push...', 'progress text is listening for a git push');

    await percySnapshot('Start Course - Listening for Git push');

    let repository = this.server.schema.repositories.find(1);
    this.server.create('submission', { repository, courseStage: repository.course.stages.models.find((stage) => stage.position === 1) });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 8, 'poll request was executed');
    assert.ok(coursePage.completedStepNotice.isVisible, 'completed step notice is visible');
    assert.ok(coursePage.repositorySetupCard.continueButton.isVisible, 'continue button is visible');

    await percySnapshot('Start Course - Git Push Received');

    await coursePage.repositorySetupCard.continueButton.click();
    assert.strictEqual(currentURL(), '/courses/dummy/stages/ah7?repo=1', 'current URL is course page URL');

    await percySnapshot('Start Course - Waiting For Second Push', {
      percyCss: '#course-page-scrollable-area { overflow-y: visible !important; }',
    });

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });

  test('repository dropdown has the correct tooltip copy', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.content.actions[1].hover();

    assertTooltipContent(assert, {
      contentString: 'Please select a language first',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.content.actions[2].hover();

    assertTooltipContent(assert, {
      contentString: 'Please select a language first',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.content.actions[1].hover();

    assertTooltipNotRendered(assert);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.content.actions[2].hover();

    assertTooltipNotRendered(assert);
  });

  test('can start repo and abandon halfway (regression)', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    assert.contains(currentURL(), '/courses/dummy/introduction?repo=1', 'current URL includes repo ID');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await coursePage.desktopHeader.clickOnCloseCourseButton();
    await catalogPage.clickOnTrack('Python');
    await trackPage.clickOnCourseCard('Build your own Dummy →');

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Introduction', 'step name is introduction');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');

    await animationsSettled();
  });

  test('started and abandoned repo course card redirects correctly', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    const python = this.server.schema.languages.findBy({ slug: 'python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    this.server.create('repository', { user, language: python, course: course });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Introduction', 'step name is introduction');
    assert.contains(currentURL(), '/courses/dummy/introduction', 'has correct URL');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');
  });
});
