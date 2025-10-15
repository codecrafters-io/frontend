import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | repository-poller', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('poller instances are not refreshed when changing between stages', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    window.pollerInstances = []; // TODO: Do this for ALL tests?

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/stages/lr7', 'current URL is course page URL');
    assert.strictEqual(window.pollerInstances.length, 2, 'poller instance is created');

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    assert.strictEqual(currentURL(), '/courses/dummy/stages/ah7', 'stage 1 is shown');
    assert.strictEqual(window.pollerInstances.length, 2, 'poller instance is created');
  });
});
