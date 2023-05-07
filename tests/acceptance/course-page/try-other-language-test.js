import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | try-other-language', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

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
      courseStage: redis.stages.models.sort((a, b) => a.position - b.position)[0],
    });

    let baseRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'notify page view (courses listing page)',
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
      'notify page view (course page)',
    ].length;

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');
    assert.strictEqual(this.server.pretender.handledRequests.length, baseRequestsCount);

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'repository with last push should be active');
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(this.server.pretender.handledRequests.length, baseRequestsCount + 2); // Fetch languages, course language requests

    assert.strictEqual(currentURL(), '/courses/redis?fresh=true');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    await coursePage.setupItem.clickOnLanguageButton('Go');

    baseRequestsCount += 2; // For some reason, we're rendering the "Request Other" button again when a language is chosen.

    assert.strictEqual(this.server.pretender.handledRequests.length, baseRequestsCount + 3); // fetch languages, requests + Create repository request
    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, 'Go', 'Repository name should change');
    assert.strictEqual(currentURL(), '/courses/redis?repo=2');

    let repository = this.server.schema.repositories.find(2);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    await this.clock.tick(2001); // Run poller
    await finishRender();

    assert.strictEqual(this.server.pretender.handledRequests.length, baseRequestsCount + 4, 'polling should have run');

    await this.clock.tick(2001); // Run active item index updater

    assert.strictEqual(this.server.pretender.handledRequests.length, baseRequestsCount + 5, 'polling should have run again');
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port');

    await animationsSettled();
  });
});
