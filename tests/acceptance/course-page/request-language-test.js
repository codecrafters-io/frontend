import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | request-language-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can request language', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');

    await coursePage.welcomeCard.createRepositoryQuestionnaire.clickOnRequestLanguageButton();
    await coursePage.welcomeCard.createRepositoryQuestionnaire.requestLanguageDropdown.clickOnLanguageSuggestion('Nim');

    await animationsSettled();
    assert.ok(coursePage.welcomeCard.createRepositoryQuestionnaire.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    await percySnapshot('Requested Languages Prompt');

    await coursePage.welcomeCard.createRepositoryQuestionnaire.clickOnRequestLanguageButton();
    await coursePage.welcomeCard.createRepositoryQuestionnaire.requestLanguageDropdown.clickOnLanguageSuggestion('Nim');

    await animationsSettled();
    assert.notOk(coursePage.welcomeCard.createRepositoryQuestionnaire.hasRequestedLanguagesPrompt, 'has requested languages prompt');
  });

  test('can view requested languages', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let nim = this.server.schema.languages.findBy({ name: 'Nim' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('course-language-request', { user: currentUser, language: nim, course: redis });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');
    assert.ok(coursePage.welcomeCard.createRepositoryQuestionnaire.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    await coursePage.welcomeCard.createRepositoryQuestionnaire.clickOnRequestLanguageButton();
    await coursePage.welcomeCard.createRepositoryQuestionnaire.requestLanguageDropdown.clickOnLanguageSuggestion('Nim');

    await animationsSettled();
    assert.notOk(coursePage.welcomeCard.createRepositoryQuestionnaire.hasRequestedLanguagesPrompt, 'requested languages prompt is removed');
  });

  test('can view no language found text', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own grep');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Introduction', 'step name is introduction');

    await coursePage.welcomeCard.createRepositoryQuestionnaire.clickOnRequestLanguageButton();
    await coursePage.welcomeCard.createRepositoryQuestionnaire.requestLanguageDropdown.fillInLanguage('Unknown');

    await animationsSettled();
    await percySnapshot('Unknown Request Language');
  });

  test('does not see language prompt if requested language is now supported', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('course-language-request', {
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ name: 'Python' }),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await animationsSettled();

    assert.notOk(coursePage.welcomeCard.createRepositoryQuestionnaire.hasRequestedLanguagesPrompt, 'does not requested languages prompt');
  });

  test('sees language prompt if subset of requested languages are still unsupported', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('course-language-request', {
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ name: 'Python' }),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
    });

    this.server.create('course-language-request', {
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ name: 'Nim' }),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await animationsSettled();

    assert.ok(coursePage.welcomeCard.createRepositoryQuestionnaire.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    assert.strictEqual(
      coursePage.welcomeCard.createRepositoryQuestionnaire.requestedLanguagesPrompt.willLetYouKnowText,
      "We'll let you know once Nim support is available on this challenge.",
    );
  });
});
