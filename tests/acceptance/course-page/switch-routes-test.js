import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';

module('Acceptance | course-page | switch-routes', function (hooks) {
  setupApplicationTest(hooks);

  test('moving between stages resets scroll position to the top of the page', async function (assert) {
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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');

    const scrollableArea = document.querySelector('#course-page-scrollable-area');
    scrollableArea.scrollTop = 100;

    await coursePage.sidebar.clickOnStepListItem('Respond to multiple PINGs');
    assert.strictEqual(scrollableArea.scrollTop, 0, 'scroll position is reset to the top of the page');
  });
});
