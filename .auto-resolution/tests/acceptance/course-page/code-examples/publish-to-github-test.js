import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';

module('Acceptance | course-page | code-examples | publish-to-github', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can publish to GitHub if unpublished', async function (assert) {
    testScenario(this.server);
    const currentUser = signIn(this.owner, this.server);

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    createCommunityCourseStageSolution(this.server, redis, 2, python);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');

    assert.notOk(coursePage.configureGithubIntegrationModal.isVisible, 'configure github integration modal should not be visible');

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnPublishToGithubButton();
    assert.ok(coursePage.configureGithubIntegrationModal.isVisible, 'configure github integration modal should be visible');

    // The rest is tested in course-page/publish-to-github-test.js
  });
});
