import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | try-other-language', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can try other language', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    console.log('testing');

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    let expectedRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
      'fetch hints (course page)',
      // 'fetch language guide (course page)',
    ].length;

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(apiRequestsCount(this.server), expectedRequestsCount, `expected ${expectedRequestsCount} requests`);

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'repository with last push should be active');
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING', 'first stage should be active');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    expectedRequestsCount += [
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
      'fetch languages (course page)',
      'fetch leaderboard entries (after ember-data upgrade)',
    ].length;

    assert.strictEqual(apiRequestsCount(this.server), expectedRequestsCount, `expected ${expectedRequestsCount} requests`);
    assert.strictEqual(currentURL(), '/courses/redis/introduction?repo=new');
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Introduction', 'step name is introduction');

    await coursePage.createRepositoryCard.clickOnLanguageButton('Go');
    await animationsSettled();

    //prettier-ignore
    expectedRequestsCount += [
      'fetch languages',
      'fetch requests',
      'create repository',
      'fetch leaderboard entries',
    ].length;

    assert.strictEqual(apiRequestsCount(this.server), expectedRequestsCount, `expected ${expectedRequestsCount} requests`);
    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, 'Go', 'Repository name should change');
    assert.strictEqual(currentURL(), '/courses/redis/introduction?repo=2', 'current URL is course page URL with repo query param');

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
    assert.strictEqual(apiRequestsCount(this.server), expectedRequestsCount + 5, 'polling should have run');

    assert.ok(coursePage.repositorySetupCard.statusIsComplete, 'current status is complete');

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    assert.strictEqual(apiRequestsCount(this.server), expectedRequestsCount + 7, 'polling should have run again');
  });

  test('can try other language from repository setup page (regression)', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.sidebar.clickOnStepListItem('Repository Setup');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Introduction', 'step name is introduction');
  });
});
