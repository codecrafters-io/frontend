import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | try-other-language', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can try other language', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').firstObject,
    });

    let baseRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
    ].length;

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');
    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount, `expected ${baseRequestsCount} requests`);

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'repository with last push should be active');
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', 'first stage should be active');

    await coursePage.repositoryDropdown.click();
    await settled(); // This is supposed to be executed as part of the click action above, but it isn't?
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 2, `expected ${baseRequestsCount + 2} requests`); // Fetch languages, course language requests

    assert.strictEqual(currentURL(), '/courses/redis?fresh=true');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    await coursePage.setupItem.clickOnLanguageButton('Go');

    baseRequestsCount += 2; // For some reason, we're rendering the "Request Other" button again when a language is chosen.

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 3, `expected ${baseRequestsCount + 3} requests`); // fetch languages, requests + Create repository request
    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, 'Go', 'Repository name should change');
    assert.strictEqual(currentURL(), '/courses/redis?repo=2', 'current URL is course page URL with repo query param');

    let repository = this.server.schema.repositories.find(2);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    window.pollerInstances.map((poller) => poller.forcePoll());
    await settled();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 5, 'polling should have run');

    window.pollerInstances.map((poller) => poller.forcePoll());
    await settled();

    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 7, 'polling should have run again');
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port');

    await animationsSettled();
  });
});
