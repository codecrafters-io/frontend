import verifyApiRequests from 'codecrafters-frontend/tests/support/verify-api-requests';
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

  test('can auto select language coming from track page', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnTrack('Python');
    await trackPage.clickOnCourseCard('Build your own Dummy →');

    await percySnapshot('Auto Select Language - Before Clicking Show-Other-Languages Button');

    assert.strictEqual(coursePage.createRepositoryCard.expandedSectionTitle, 'Preferred Language', 'current section title is preferred language');
    assert.strictEqual(coursePage.createRepositoryCard.languageButtons.length, 1, 'only one language-button can be visible');
    assert.strictEqual(coursePage.createRepositoryCard.languageButtons[0].text, 'Python', 'the only one language-button must be Python');
    assert.ok(coursePage.createRepositoryCard.showOtherLanguagesButton.isVisible, 'show-other-languages button is visible');

    await coursePage.createRepositoryCard.showOtherLanguagesButton.click();
    await percySnapshot('Auto Select Language - After Clicking Show-Other-Languages Button');

    assert.ok(coursePage.createRepositoryCard.languageButtons.length > 1, 'more than one language button are visible');
    assert.ok(coursePage.createRepositoryCard.showOtherLanguagesButton.isHidden, 'show-other-languages button is hidden');

    await animationsSettled();
  });

  test('can start course', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/introduction', 'current URL is course page URL');

    let expectedRequests = [
      '/api/v1/repositories',      // fetch repositories (catalog page)
      '/api/v1/courses',          // fetch courses (catalog page)
      '/api/v1/languages',        // fetch languages (catalog page)
      '/api/v1/courses',          // fetch course details (course overview page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course overview page)
      '/api/v1/courses',          // refresh course (course page)
      '/api/v1/repositories',     // fetch repositories (course page)
      '/api/v1/course-language-requests', // fetch language requests (course page)
      '/api/v1/languages',        // fetch languages (course page)
      '/api/v1/course-leaderboard-entries' // fetch leaderboard entries (course page)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence');

    await percySnapshot('Start Course - Select Language');

    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');
    assert.strictEqual(coursePage.createRepositoryCard.expandedSectionTitle, 'Preferred Language', 'current section title is preferred language');

    assert.strictEqual(coursePage.header.progressIndicatorText, 'Select a language to proceed', 'progress indicator says select language to proceed');

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();

    expectedRequests = [...expectedRequests, 
      '/api/v1/repositories',     // create repository (after language selection)
      '/api/v1/courses',          // refresh course (after language selection)
      '/api/v1/repositories',     // update repositories (after language selection)
      '/api/v1/course-leaderboard-entries' // update leaderboard (after language selection)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after language selection');

    assert.strictEqual(coursePage.createRepositoryCard.expandedSectionTitle, 'Language Proficiency', 'current section title is language proficiency');
    await percySnapshot('Start Course - Select Language Proficiency');

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    expectedRequests = [...expectedRequests, 
      '/api/v1/repositories',     // poll repositories (course page)
      '/api/v1/course-leaderboard-entries' // poll leaderboard (course page)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after polling');

    assert.notOk(coursePage.createRepositoryCard.continueButton.isVisible, 'continue button is not visible');

    await coursePage.createRepositoryCard.clickOnOptionButton('Beginner');
    await animationsSettled();
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

    assert.strictEqual(coursePage.header.stepName, 'Repository Setup', 'step name is repository setup');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Listening for a git push...', 'progress text is listening for a git push');

    assert.strictEqual(coursePage.repositorySetupCard.gitCloneIssuesLink.text, 'Running into issues with the git clone step');
    assert.strictEqual(coursePage.repositorySetupCard.gitCloneIssuesLink.href, 'https://docs.codecrafters.io/troubleshooting/fix-clone-errors');
    assert.strictEqual(coursePage.repositorySetupCard.runGitCommandsLink.text, 'Not sure how to run git commands');
    assert.strictEqual(
      coursePage.repositorySetupCard.runGitCommandsLink.href,
      'https://docs.codecrafters.io/challenges/how-challenges-work#how-to-run-git-commands',
    );

    await percySnapshot('Start Course - Listening for Git push');

    let repository = this.server.schema.repositories.find(1);
    this.server.create('submission', { repository, courseStage: repository.course.stages.models.find((stage) => stage.position === 1) });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    expectedRequests = [
      ...expectedRequests,
      '/api/v1/repositories/1',   // poll repository status (course page)
      '/api/v1/repositories/1',   // poll repository updates (course page)
      '/api/v1/repositories/1',   // poll repository changes (course page)
      '/api/v1/repositories',     // update repositories (after status change)
      '/api/v1/course-leaderboard-entries' // update leaderboard (after status change)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after polling');

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
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.content.actions[2].hover();

    assertTooltipContent(assert, {
      contentString: 'Please select a language first',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.content.actions[1].hover();

    assertTooltipNotRendered(assert);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

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

    await coursePage.header.clickOnCloseCourseButton();
    await catalogPage.clickOnTrack('Python');
    await trackPage.clickOnCourseCard('Build your own Dummy →');

    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');

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

    assert.strictEqual(currentURL(), '/courses/dummy/overview', 'should navigate to overview page first');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');
    assert.contains(currentURL(), '/courses/dummy/introduction', 'has correct URL');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 0, 'non active repositories should be 0');
  });
});
