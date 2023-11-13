import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | language-guides', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view language guides', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('course-stage-language-guide', {
      markdownForBeginner: 'In this stage, blah blah...',
      courseStage: redis.stages.models.sortBy('position')[1],
      language: python,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    document.getElementById('language-guide-card')?.scrollIntoView();

    await coursePage.languageGuideCard.clickOnExpandButton();
    await coursePage.languageGuideCard.clickOnCollapseButton();
    await coursePage.languageGuideCard.clickOnExpandButton();

    await coursePage.languageGuideCard.languageDropdown.toggle();
    await coursePage.languageGuideCard.languageDropdown.clickOnLink('Go');
    assert.strictEqual(coursePage.languageGuideCard.languageDropdown.currentLanguageName, 'Go');

    await coursePage.languageGuideCard.backToRepositoryLanguageButton.click();
    assert.strictEqual(coursePage.languageGuideCard.languageDropdown.currentLanguageName, 'Python');
  });
});
