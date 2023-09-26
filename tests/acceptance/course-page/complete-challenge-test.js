import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit } from '@ember/test-helpers';

module('Acceptance | course-page | complete-challenge-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can complete course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    redis.stages.models.forEach((courseStage) => {
      this.server.create('submission', 'withSuccessStatus', {
        repository: repository,
        courseStage: courseStage,
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    assert.strictEqual(currentURL(), '/courses/redis/completed', 'URL is /courses/redis/completed');

    assert.contains(coursePage.courseCompletedCard.instructionsText, 'Congratulations are in order. Only ~30% of users');

    await percySnapshot('Course Completed Page');

    await coursePage.courseCompletedCard.clickOnPublishToGithubLink();
    assert.ok(coursePage.configureGithubIntegrationModal.isOpen, 'configure github integration modal is open');
  });

  test('visiting /completed route without completing course redirects to correct stage', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await visit('/courses/redis/completed');
    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'URL is /stages/2');
  });
});
