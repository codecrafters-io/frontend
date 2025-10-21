import verifyApiRequests from 'codecrafters-frontend/tests/support/verify-api-requests';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';

module('Acceptance | course-page | try-other-language', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can try other language', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    let expectedRequests = [
      '/api/v1/repositories', // fetch repositories (catalog page)
      '/api/v1/courses', // fetch courses (catalog page)
      '/api/v1/languages', // fetch languages (catalog page)
      '/api/v1/courses', // fetch course details (course overview page)
      '/api/v1/repositories', // fetch repositories (catalog page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course overview page)
      '/api/v1/courses', // refresh course (course page)
      '/api/v1/repositories', // fetch repositories (course page)
      '/api/v1/course-stage-comments', // fetch stage comments (course page)
      '/api/v1/course-stage-language-guides', // fetch language guides (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course page)
    ];

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence');

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'repository with last push should be active');
    assert.strictEqual(coursePage.header.stepName, 'The second stage', 'first stage should be active');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    expectedRequests = [
      ...expectedRequests,
      '/api/v1/courses', // refresh course (after try different language)
      '/api/v1/repositories', // update repositories (after try different language)
      '/api/v1/course-language-requests', // fetch language requests (after try different language)
      '/api/v1/languages', // fetch languages (after try different language)
      '/api/v1/course-leaderboard-entries', // update leaderboard (after try different language)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after clicking try different language');
    assert.strictEqual(currentURL(), '/courses/dummy/introduction?repo=new');
    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');

    await coursePage.createRepositoryCard.clickOnLanguageButton('Go');
    await animationsSettled();

    expectedRequests = [
      ...expectedRequests,
      '/api/v1/repositories', // create repository (after selecting Go)
      '/api/v1/courses', // refresh course (after selecting Go)
      '/api/v1/repositories', // update repositories (after selecting Go)
      '/api/v1/course-leaderboard-entries', // update leaderboard (after selecting Go)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after selecting Go language');
    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, 'Go', 'Repository name should change');
    assert.strictEqual(currentURL(), '/courses/dummy/introduction?repo=2', 'current URL is course page URL with repo query param');

    await coursePage.createRepositoryCard.clickOnOptionButton('Beginner');
    await animationsSettled();
    await coursePage.createRepositoryCard.clickOnNextQuestionButton();
    await animationsSettled();
    await coursePage.createRepositoryCard.clickOnOptionButton('Every day');
    await animationsSettled();
    await coursePage.createRepositoryCard.clickOnOptionButton('Yes please');
    await animationsSettled();
    await coursePage.createRepositoryCard.clickOnContinueButton();

    assert.ok(coursePage.repositorySetupCard.statusIsInProgress, 'current status is in progress');

    let repository = this.server.schema.repositories.find(2);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expectedRequests = [
      ...expectedRequests,
      '/api/v1/repositories/2', // poll repository status (course page)
      '/api/v1/repositories/2', // poll repository updates (course page)
      '/api/v1/repositories/2', // poll repository changes (course page)
      '/api/v1/repositories', // update repositories (after status change)
      '/api/v1/course-leaderboard-entries', // update leaderboard (after status change)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after first poll');

    assert.ok(coursePage.repositorySetupCard.statusIsComplete, 'current status is complete');

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expectedRequests = [
      ...expectedRequests,
      '/api/v1/repositories', // poll repositories (course page)
      '/api/v1/course-leaderboard-entries', // poll leaderboard (course page)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after second poll');
  });

  test('can try other language from repository setup page (regression)', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('Repository Setup');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');
  });
});
