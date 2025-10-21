import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplePage from 'codecrafters-frontend/tests/pages/course-admin/code-example-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-admin | code-examples | pin', function (hooks) {
  setupApplicationTest(hooks);

  test('can pin code example', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'dummy' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    const solution = createCommunityCourseStageSolution(this.server, redis, 2, go);

    await codeExamplePage.visit({ course_slug: 'dummy', code_example_id: solution.id });
    await codeExamplePage.clickOnPinCodeExampleToggle();

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('The second stage');

    await coursePage.clickOnHeaderTabLink('Code Examples');
    assert.true(codeExamplesPage.solutionCards[0].text.includes("Editor's choice"));
  });
});
