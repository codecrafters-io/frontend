import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import codeExampleInsightsIndexPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-insights-index-page';
import { currentURL } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createCommunitySolutionsAnalysis from 'codecrafters-frontend/mirage/utils/create-community-solutions-analysis';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

module('Acceptance | course-admin | code-example-insights-index', function (hooks) {
  setupApplicationTest(hooks);

  test('code examlpe insights index page tests', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.currentUser = this.server.schema.users.first();
    this.language_1 = this.server.schema.languages.findBy({ name: 'C' });
    this.language_2 = this.server.schema.languages.findBy({ name: 'Python' });
    this.course = this.server.schema.courses.findBy({ slug: 'redis' });
    this.courseStage_1 = this.course.stages.models.toSorted(fieldComparator('position'))[0];
    this.courseStage_2 = this.course.stages.models.toSorted(fieldComparator('position'))[1];

    this.analysis = createCommunitySolutionsAnalysis(this.server, this.courseStage_1, this.language_1);
    this.analysis = createCommunitySolutionsAnalysis(this.server, this.courseStage_2, this.language_2);

    // Visiting /courses/shell/admin/code-examples should redirect to
    // the page for the first language in the list
    await codeExampleInsightsIndexPage.visit({ course_slug: this.course.slug });
    assert.strictEqual(codeExampleInsightsIndexPage.stageListItems.length, 55);

    let stageEntries_1 = codeExampleInsightsIndexPage.stageListItems[0].text;
    assert.strictEqual(stageEntries_1, `${this.courseStage_1.name} 1 solutions 10 lines 0 upvotes 0 downvotes`, 'Stage list item text is correct');

    assert.strictEqual(codeExampleInsightsIndexPage.languageDropdown.currentLanguageName, 'C');

    // Language dropdown should work
    await codeExampleInsightsIndexPage.languageDropdown.click();
    await codeExampleInsightsIndexPage.languageDropdown.clickOnLanguageLink('Python');
    assert.strictEqual(codeExampleInsightsIndexPage.languageDropdown.currentLanguageName, 'Python');
    assert.strictEqual(codeExampleInsightsIndexPage.stageListItems.length, 55);

    assert.strictEqual(currentURL(), '/courses/redis/admin/code-examples?language_slug=python');

    let stageEntries_2 = codeExampleInsightsIndexPage.stageListItems[1].text;
    assert.strictEqual(stageEntries_2, `${this.courseStage_2.name} 1 solutions 10 lines 0 upvotes 0 downvotes`, 'Stage list item text is correct');
  });
});
