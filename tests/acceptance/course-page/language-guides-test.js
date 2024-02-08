import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | language-guides', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

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

  test('can submit feedback for language guides', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ name: 'Go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('course-stage-language-guide', {
      markdownForBeginner: 'In this stage, blah blah...',
      courseStage: redis.stages.models.sortBy('position')[1],
      language: go,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    document.getElementById('language-guide-card')?.scrollIntoView();

    await coursePage.languageGuideCard.clickOnExpandButton();
    assert.strictEqual(coursePage.languageGuideCard.languageDropdown.currentLanguageName, 'Go');

    const feedbackDropdown = coursePage.languageGuideCard.feedbackDropdown;
    await feedbackDropdown.toggle();
    await feedbackDropdown.fillInExplanation('This is test feedback for language guides');
    await feedbackDropdown.clickOnSendButton();

    const feedbackSubmission = this.server.schema.siteFeedbackSubmissions.first();
    assert.strictEqual(feedbackSubmission.source, 'course_stage_language_guide');
    assert.strictEqual(JSON.stringify(feedbackSubmission.sourceMetadata), JSON.stringify({ language_slug: 'go' }));
  });
});
