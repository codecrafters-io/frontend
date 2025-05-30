import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | code-examples | expand-collapse', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can expand and collapse solutions', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    createCommunityCourseStageSolution(this.server, redis, 2, go);
    createCommunityCourseStageSolution(this.server, redis, 2, go);
    createCommunityCourseStageSolution(this.server, redis, 2, go);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');

    await coursePage.clickOnHeaderTabLink('Code Examples');

    assert.strictEqual(codeExamplesPage.solutionCards.length, 3, 'expected 3 solutions to be present');

    // First solution should be expanded by default
    assert.ok(codeExamplesPage.solutionCards[0].isExpanded, 'first solution should be expanded by default');
    assert.ok(codeExamplesPage.solutionCards[1].isCollapsed, 'second solution should be collapsed');
    assert.ok(codeExamplesPage.solutionCards[2].isCollapsed, 'third solution should be collapsed');

    // Collapse first solution
    await codeExamplesPage.solutionCards[0].toggleMoreDropdown();
    await codeExamplesPage.solutionCards[0].moreDropdown.clickOnLink('Collapse example');
    assert.ok(codeExamplesPage.solutionCards[0].isCollapsed, 'first solution should be collapsed after clicking collapse button');

    // Expand second solution
    await codeExamplesPage.solutionCards[1].clickOnExpandButton();
    assert.ok(codeExamplesPage.solutionCards[0].isCollapsed, 'first solution should be collapsed after clicking expand button');
    assert.ok(codeExamplesPage.solutionCards[1].isExpanded, 'second solution should be expanded after clicking expand button');
    assert.ok(codeExamplesPage.solutionCards[2].isCollapsed, 'third solution should be collapsed after clicking expand button');

    // Expand third solution
    await codeExamplesPage.solutionCards[2].clickOnExpandButton();
    assert.ok(codeExamplesPage.solutionCards[0].isCollapsed, 'first solution should be collapsed after clicking expand button');
    assert.ok(codeExamplesPage.solutionCards[1].isCollapsed, 'second solution should be collapsed after clicking expand button');
    assert.ok(codeExamplesPage.solutionCards[2].isExpanded, 'third solution should be expanded after clicking expand button');
  });
});
