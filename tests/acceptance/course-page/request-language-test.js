import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | request-language-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can request language', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.repositorySetupCard.isOnCreateRepositoryStep, 'current step is create repository step');

    await coursePage.repositorySetupCard.clickOnRequestLanguageButton();
    await coursePage.repositorySetupCard.requestLanguageDropdown.clickOnLanguageSuggestion('Kotlin');

    await animationsSettled();
    assert.ok(coursePage.repositorySetupCard.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    await percySnapshot('Requested Languages Prompt');

    await coursePage.repositorySetupCard.clickOnRequestLanguageButton();
    await coursePage.repositorySetupCard.requestLanguageDropdown.clickOnLanguageSuggestion('Kotlin');

    await animationsSettled();
    assert.notOk(coursePage.repositorySetupCard.hasRequestedLanguagesPrompt, 'has requested languages prompt');
  });

  test('can view requested languages', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let kotlin = this.server.schema.languages.findBy({ name: 'Kotlin' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.create('course-language-request', { user: currentUser, language: kotlin, course: docker });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.repositorySetupCard.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.repositorySetupCard.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    await coursePage.repositorySetupCard.clickOnRequestLanguageButton();
    await coursePage.repositorySetupCard.requestLanguageDropdown.clickOnLanguageSuggestion('Kotlin');

    await animationsSettled();
    assert.notOk(coursePage.repositorySetupCard.hasRequestedLanguagesPrompt, 'requested languages prompt is removed');
  });

  test('can view no language found text', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.repositorySetupCard.isOnCreateRepositoryStep, 'current step is create repository step');

    await coursePage.repositorySetupCard.clickOnRequestLanguageButton();
    await coursePage.repositorySetupCard.requestLanguageDropdown.fillInLanguage('Unknown');

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

    assert.notOk(coursePage.repositorySetupCard.hasRequestedLanguagesPrompt, 'does not requested languages prompt');
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
      language: this.server.schema.languages.findBy({ name: 'Kotlin' }),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await animationsSettled();

    assert.ok(coursePage.repositorySetupCard.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    assert.strictEqual(
      coursePage.repositorySetupCard.requestedLanguagesPrompt.willLetYouKnowText,
      "We'll let you know once Kotlin support is available on this challenge.",
    );
  });
});
