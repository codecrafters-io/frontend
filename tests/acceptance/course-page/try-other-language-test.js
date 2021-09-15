import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import signIn from 'codecrafters-frontend/tests/support/sign-in';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | try-other-language', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can try other language', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(currentURL(), '/courses/next/redis', 'current URL is course page URL');
    assert.equal(this.server.pretender.handledRequests.length, 4); // Fetch course (courses page + course page) + fetch repositories + leaderboard

    assert.equal(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'repository with last push should be active');
    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.equal(currentURL(), '/courses/next/redis?fresh=true');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    await coursePage.setupItem.clickOnLanguageButton('Go');

    assert.equal(this.server.pretender.handledRequests.length, 5); // Create repository request
    assert.equal(coursePage.repositoryDropdown.activeRepositoryName, 'Language #n', 'Repository name should change');
    assert.equal(currentURL(), '/courses/next/redis?repo=2');

    let repository = this.server.schema.repositories.find(2);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    await this.clock.tick(2001); // Run poller
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 6, 'polling should have run');

    await this.clock.tick(2001); // Run active item index updater

    assert.equal(this.server.pretender.handledRequests.length, 7, 'polling should have run again');
    assert.equal(coursePage.activeCourseStageItem.title, 'Bind to a port');
  });
});
