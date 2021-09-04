import { currentURL, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import signIn from 'codecrafters-frontend/tests/support/sign-in';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | start-course-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can start course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    assert.equal(currentURL(), '/courses/next/redis', 'current URL is course page URL');

    assert.equal(this.server.pretender.handledRequests.length, 3); // Fetch course (courses page + course page) + fetch repositories

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    await coursePage.setupItem.clickOnLanguageButton('Python');

    assert.equal(this.server.pretender.handledRequests.length, 4); // Create Repository

    assert.ok(coursePage.setupItem.isOnCloneRepositoryStep, 'current step is clone repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    this.clock.tick(5000);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 5); // Ensure poll happened
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is still in-progress');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmissionAt: new Date() });

    this.clock.tick(5000);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 6); // Ensure poll happened
    assert.ok(coursePage.setupItem.statusIsComplete, 'current status is complete');

    await settled(); // Timer should be cancelled at this point
  });
});
