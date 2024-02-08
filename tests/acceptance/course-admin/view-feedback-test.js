import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import feedbackPage from 'codecrafters-frontend/tests/pages/course-admin/feedback-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-feedback', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders when no feedback is present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await feedbackPage.visit({ course_slug: 'redis' });
    assert.strictEqual(feedbackPage.feedbackListItems.length, 0, 'should have no feedback');

    await percySnapshot('Admin - Stage Feedback - No Feedback');
  });

  test('it renders when feedback is present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    const language = this.server.schema.languages.findBy({ slug: 'ruby' });
    const user = this.server.schema.users.first();

    const repository = this.server.schema.repositories.create({
      course,
      language,
      user,
    });

    const other_user = this.server.schema.users.create({ username: 'other_user' });

    const other_repository = this.server.schema.repositories.create({
      course,
      language,
      user: other_user,
    });

    this.server.create('course-stage-feedback-submission', {
      courseStage: this.server.schema.courseStages.findBy({ courseId: course.id, slug: 'init' }),
      language,
      repository,
      user,
      isAcknowledgedByStaff: false,
      selectedAnswer: '😊',
      status: 'closed',
    });

    this.server.create('course-stage-feedback-submission', {
      courseStage: this.server.schema.courseStages.findBy({ courseId: course.id, slug: 'init' }),
      language,
      repository: other_repository,
      user: other_user,
      isAcknowledgedByStaff: false,
      selectedAnswer: '😊',
      explanation: 'This is a dummy explanation.',
      status: 'closed',
    });

    await feedbackPage.visit({ course_slug: 'redis' });
    assert.strictEqual(feedbackPage.feedbackListItems.length, 2, 'should have 2 feedback');
    await percySnapshot('Admin - Stage Feedback - With Feedback');
  });

  test('it does not render feedback where the status is open', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    const language = this.server.schema.languages.findBy({ slug: 'ruby' });
    const user = this.server.schema.users.first();

    const repository = this.server.schema.repositories.create({
      course,
      language,
      user,
    });

    this.server.create('course-stage-feedback-submission', {
      courseStage: this.server.schema.courseStages.findBy({ courseId: course.id, slug: 'init' }),
      language,
      repository,
      user,
      isAcknowledgedByStaff: false,
      selectedAnswer: '😊',
      status: 'open',
    });

    await feedbackPage.visit({ course_slug: 'redis' });
    assert.strictEqual(feedbackPage.feedbackListItems.length, 0, 'should have 0 feedback');
  });
});
