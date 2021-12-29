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
});
