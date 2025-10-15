import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { waitUntil } from '@ember/test-helpers';

module('Acceptance | course-page | code-examples | toggle-diff-source', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can toggle diff source if staff', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    createCommunityCourseStageSolution(this.server, dummy, 2, go);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('The second stage');

    await coursePage.clickOnHeaderTabLink('Code Examples');
    assert.strictEqual(codeExamplesPage.solutionCards.length, 1, 'expected 1 Go solution to be present');

    const moreDropdown = codeExamplesPage.solutionCards[0].moreDropdown;

    await codeExamplesPage.solutionCards[0].toggleMoreDropdown();
    await waitUntil(() => moreDropdown.links.length === 2);
    assert.ok(moreDropdown.hasLink('View full diff'), 'expected View full diff link to be present');
    assert.notOk(moreDropdown.hasLink('View highlighted files'), 'expected View highlighted files link to not be present');

    await moreDropdown.clickOnLink('View full diff');

    await codeExamplesPage.solutionCards[0].toggleMoreDropdown();
    await waitUntil(() => moreDropdown.links.length === 2);
    assert.notOk(moreDropdown.hasLink('View full diff'), 'expected View full diff link to be removed');
    assert.ok(moreDropdown.hasLink('View highlighted files'), 'expected View highlighted files link to be present');
  });
});
