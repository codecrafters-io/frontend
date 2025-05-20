import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import codeExampleInsightsIndexPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-insights-index-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createLanguages from 'codecrafters-frontend/mirage/utils/create-languages';
import createCourseFromData from 'codecrafters-frontend/mirage/utils/create-course-from-data';
import createCommunitySolutionsAnalysis from 'codecrafters-frontend/mirage/utils/create-community-solutions-analysis';

// 1. Visiting /courses/shell/admin/code-examples should redirect to ?language_slug=c for the first language in the list
// 2. Language dropdown should work
// 3. Clicking on a stage should redirect to the code example insights page for that stage
module('Acceptance | course-admin | code-example-insights-index', function (hooks) {
  setupApplicationTest(hooks);

  test('opening insights index page with no language slug redirects to language slug "c"', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.currentUser = this.server.schema.users.first();
    this.language_1 = this.server.schema.languages.findBy({ name: 'C' });
    this.language_2 = this.server.schema.languages.findBy({ name: 'Python' });
    this.course = this.server.schema.courses.findBy({ slug: 'redis' });
    this.courseStage_1 = this.course.stages.models.sortBy('position')[0];
    this.courseStage_2 = this.course.stages.models.sortBy('position')[1];

    this.analysis = createCommunitySolutionsAnalysis(this.server, this.courseStage_1, this.language_1)
    this.analysis = createCommunitySolutionsAnalysis(this.server, this.courseStage_2, this.language_2)

    await codeExampleInsightsIndexPage.visit({ course_slug: this.course.slug });
    assert.strictEqual(codeExampleInsightsIndexPage.stageListItems.length, 55); 
    
    let itemsText = codeExampleInsightsIndexPage.stageListItems[0].text;
    assert.strictEqual(
      itemsText,
      `${this.courseStage_1.name} 1 solutions 10 lines 0 upvotes 0 downvotes`,
      'Stage list item text is correct'
    );

    assert.strictEqual(codeExampleInsightsIndexPage.languageDropdown.currentLanguageName, 'C');

    await codeExampleInsightsIndexPage.languageDropdown.click();
    await codeExampleInsightsIndexPage.languageDropdown.clickOnLanguageLink('Python');
    assert.strictEqual(codeExampleInsightsIndexPage.languageDropdown.currentLanguageName, 'Python');
    assert.strictEqual(codeExampleInsightsIndexPage.stageListItems.length, 55);

    let itemsText_2 = codeExampleInsightsIndexPage.stageListItems[1].text;
    assert.strictEqual(
      itemsText_2,
      `${this.courseStage_2.name} 1 solutions 10 lines 0 upvotes 0 downvotes`,
      'Stage list item text is correct'
    );
  });
});
