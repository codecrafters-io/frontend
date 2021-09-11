import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import signIn from 'codecrafters-frontend/tests/support/sign-in';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | fail-course-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can fail course stage', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    let currentUser = this.owner.lookup('service:currentUser').record;

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    assert.equal(currentURL(), '/courses/next/redis', 'current URL is course page URL');
    assert.equal(this.server.pretender.handledRequests.length, 3); // Fetch course (courses page + course page) + fetch repositories

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING');
    assert.equal(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...');
    //
    // await this.pauseTest();
  });
});
