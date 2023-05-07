import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import userPage from 'codecrafters-frontend/tests/pages/user-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | view-user-profile', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.create('course-participation', {
      course: redis,
      language: python,
      user: currentUser,
      currentStage: redis.stages.models.sort((a, b) => a.position - b.position)[1],
    });

    this.server.create('course-participation', {
      course: redis,
      language: go,
      user: currentUser,
      currentStage: redis.stages.models.sort((a, b) => a.position - b.position)[5],
    });

    this.server.create('course-participation', {
      course: docker,
      language: go,
      user: currentUser,
      currentStage: redis.stages.models.sort((a, b) => a.position - b.position)[3],
    });

    this.server.create('user-profile-event', {
      descriptionMarkdown: 'Joined CodeCrafters',
      user: currentUser,
      type: 'CreatedAccountEvent',
      occurredAt: new Date('2020-01-01'),
    });

    this.server.create('user-profile-event', {
      descriptionMarkdown: 'Started the [Build your own Redis](https://google.com) challenge using C#',
      user: currentUser,
      type: 'StartedCourseEvent',
      occurredAt: new Date('2020-01-02'),
    });

    this.server.create('user-profile-event', {
      descriptionMarkdown: 'Completed the [Build your own Redis](https://google.com) challenge using C#',
      user: currentUser,
      type: 'CompletedCourseEvent',
      occurredAt: new Date('2020-02-01'),
    });

    await userPage.visit({ username: 'rohitpaulk' });
    await percySnapshot('User profile');

    assert.strictEqual(1, 1);
  });

  // TODO: Add test for not found
});
