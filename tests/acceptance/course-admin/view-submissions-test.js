import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import adminCourseSubmissionsPage from 'codecrafters-frontend/tests/pages/admin/course-submissions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | course-admin | view-submissions', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders when no submissions are present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await adminCourseSubmissionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(adminCourseSubmissionsPage.timelineContainer.entries.length, 0);

    await percySnapshot('Admin - Course Submissions - No Submissions');
  });

  test('it renders when submissions are present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    await adminCourseSubmissionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(adminCourseSubmissionsPage.timelineContainer.entries.length, 3);

    await percySnapshot('Admin - Course Submissions - With Submissions');
  });

  test('it filters by username(s) if given', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });
    let user3 = this.server.create('user', { username: 'user3' });

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user1 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user2 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user3 });

    await adminCourseSubmissionsPage.visit({ course_slug: 'redis', usernames: 'user1,user2' });
    assert.strictEqual(adminCourseSubmissionsPage.timelineContainer.entries.length, 4); // 2 users, 2 submissions each
  });

  test('it filters by languages(s) if given', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });
    let user3 = this.server.create('user', { username: 'user3' });

    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let ruby = this.server.schema.languages.findBy({ slug: 'ruby' });
    let javascript = this.server.schema.languages.findBy({ slug: 'javascript' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user1 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: ruby, user: user2 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: javascript, user: user3 });

    await adminCourseSubmissionsPage.visit({ course_slug: 'redis', languages: 'python,ruby' });
    assert.strictEqual(adminCourseSubmissionsPage.timelineContainer.entries.length, 4); // 2 users, 2 submissions each
  });
});
