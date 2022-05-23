import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, visit } from '@ember/test-helpers';
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

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await adminCoursesPage.visit();
    await adminCoursesPage.clickOnLink('Build your own Redis');

    assert.equal(adminCourseSubmissionsPage.timelineContainer.entries.length, 3);
    await percySnapshot('Admin - Course Submissions - With Submissions');
  });

  test('it filters by username(s) if given', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });
    let user3 = this.server.create('user', { username: 'user3' });

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let stage1 = redis.stages.models.sortBy('position')[2];

    let repository1 = this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user1 });
    let repository2 = this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user2 });
    let repository3 = this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user3 });

    await visit('/admin/courses/redis/submissions?usernames=user1,user2');
    assert.equal(adminCourseSubmissionsPage.timelineContainer.entries.length, 4); // 2 users, 2 submissions each

    await visit('/admin/courses/redis/submissions?usernames=user1');
    assert.equal(adminCourseSubmissionsPage.timelineContainer.entries.length, 2); // 1 users, 2 submissions

    await visit('/admin/courses/redis/submissions?usernames=user1,user2,user3');
    assert.equal(adminCourseSubmissionsPage.timelineContainer.entries.length, 6); // 3 users, 2 submissions each
  });
});
