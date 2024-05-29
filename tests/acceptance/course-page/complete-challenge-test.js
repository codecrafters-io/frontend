import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit } from '@ember/test-helpers';

module('Acceptance | course-page | complete-challenge-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can complete course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.create('repository', 'withAllStagesCompleted', {
      course: docker,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');
    assert.strictEqual(currentURL(), '/courses/docker/completed', 'URL is /courses/docker/completed');

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
    const docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: python,
      user: currentUser,
    });

    await visit('/courses/docker/completed');
    assert.strictEqual(currentURL(), '/courses/docker/stages/kf3', 'URL is /stages/kf3');
  });

  test('next step button in completed step notice redirects to next step if the next step is base stages completed', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withBaseStagesCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.sidebar.clickOnStepListItem('Expiry');

    assert.true(
      coursePage.completedStepNotice.nextOrActiveStepButton.text.includes('View next step'),
      'copy for next or active step button is correct',
    );

    await coursePage.completedStepNotice.nextOrActiveStepButton.click();

    assert.strictEqual(currentURL(), '/courses/redis/base-stages-completed', 'URL is /base-stages-completed');
  });
});
