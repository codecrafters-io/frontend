import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | repository-poller', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('poller instances are not refreshed when changing between stages', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    window.pollerInstances = []; // TODO: Do this for ALL tests?

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'current URL is course page URL');
    assert.strictEqual(window.pollerInstances.length, 2, 'poller instance is created');

    await coursePage.sidebar.clickOnStepListItem('Bind to a port');
    assert.strictEqual(currentURL(), '/courses/redis/stages/1', 'stage 1 is shown');
    assert.strictEqual(window.pollerInstances.length, 2, 'poller instance is created');
  });
});
