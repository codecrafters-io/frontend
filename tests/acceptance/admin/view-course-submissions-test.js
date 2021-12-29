import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import adminCoursesPage from 'codecrafters-frontend/tests/pages/admin/courses-page';
import adminCourseSubmissionsPage from 'codecrafters-frontend/tests/pages/admin/course-submissions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | admin | view-course-submissions', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders when no submissions are present', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await adminCoursesPage.visit();
    await adminCoursesPage.clickOnLink('Build your own Redis');

    assert.equal(adminCourseSubmissionsPage.timelineContainer.entries.length, 0);

    await percySnapshot('Admin - Course Submissions - No Submissions');
  });

  test('it renders when submissions are present', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    let submission = this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await adminCoursesPage.visit();
    await adminCoursesPage.clickOnLink('Build your own Redis');

    await this.pauseTest();

    assert.equal(adminCourseSubmissionsPage.timelineContainer.entries.length, 3);

    await percySnapshot('Admin - Course Submissions - No Submissions');
  });
});
