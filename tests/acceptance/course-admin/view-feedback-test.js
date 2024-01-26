import feedbackPage from 'codecrafters-frontend/tests/pages/course-admin/feedback-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-feedback', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders when no feedback is present', async function(assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await feedbackPage.visit({ course_slug: 'redis' });
    assert.strictEqual(feedbackPage.feedbackListItems.length, 0, 'should have no feedback');

    await percySnapshot('Admin - Stage Feedback - No Feedback');
  });

  test('it renders when feedback is present', async function(assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    course = this.server.schema.courses.findBy({ slug: 'redis' });
    language = this.server.schema.languages.findBy({ slug: 'ruby' });
    user = this.server.schema.users.first();

    repository = this.server.schema.repositories.create({
      course,
      language,
      user
    })


    other_user = this.server.schema.users.create({ username: 'other_user' });

    other_repository = this.server.schema.repositories.create({
      course,
      language,
      user: other_user,
    })

    this.server.create('course-stage-feedback-submission', {
      courseStage: this.server.schema.courseStages.findBy({ course, stageNumber: 1 }),
      language,
      repository,
      user,
      isAcknowledgedByStaff: false,
      selectedAnswer: "😊",
      status: "closed"
    });

    this.server.create('course-stage-feedback-submission', {
      courseStage: this.server.schema.courseStages.findBy({ course, stageNumber: 1 }),
      language,
      repository: other_repository,
      user: other_user,
      isAcknowledgedByStaff: false,
      selectedAnswer: "😊",
      explanation: "This is a dummy explanation.",
      status: "closed"
    });

    await feedbackPage.visit({ course_slug: 'redis' });
    assert.strictEqual(feedbackPage.feedbackListItems.length, 2, 'should have 2 feedback');
    await percySnapshot('Admin - Stage Feedback - With Feedback');
  });
});
