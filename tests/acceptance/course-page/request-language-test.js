import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import percySnapshot from '@percy/ember';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | request-language-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can request language', async function (assert) {
    signIn(this.owner, this.server);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.equal(currentURL(), '/courses/redis', 'current URL is course page URL');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');

    await coursePage.setupItem.clickOnRequestLanguageButton();
    await coursePage.setupItem.requestLanguageDropdown.clickOnLanguageSuggestion('Kotlin');

    await animationsSettled();
    assert.ok(coursePage.setupItem.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    await percySnapshot('Requested Languages Prompt');

    await coursePage.setupItem.clickOnRequestLanguageButton();
    await coursePage.setupItem.requestLanguageDropdown.clickOnLanguageSuggestion('Kotlin');

    await animationsSettled();
    assert.notOk(coursePage.setupItem.hasRequestedLanguagesPrompt, 'has requested languages prompt');
  });

  test('can view requested languages', async function (assert) {
    signIn(this.owner, this.server);
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.create('course-language-request', { user: currentUser, language: python, course: docker });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Docker');
    await courseOverviewPage.clickOnStartCourse();

    assert.equal(currentURL(), '/courses/docker', 'current URL is course page URL');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    await coursePage.setupItem.clickOnRequestLanguageButton();
    await coursePage.setupItem.requestLanguageDropdown.clickOnLanguageSuggestion('Python');

    await animationsSettled();
    assert.notOk(coursePage.setupItem.hasRequestedLanguagesPrompt, 'requested languages prompt is removed');
  });

  test('can view no language found text', async function (assert) {
    signIn(this.owner, this.server);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Docker');
    await courseOverviewPage.clickOnStartCourse();

    assert.equal(currentURL(), '/courses/docker', 'current URL is course page URL');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');

    await coursePage.setupItem.clickOnRequestLanguageButton();
    await coursePage.setupItem.requestLanguageDropdown.fillInLanguage('Unknown');

    await animationsSettled();
    await percySnapshot('Unknown Request Language');
  });

  test('does not see language prompt if requested language is now supported', async function (assert) {
    signIn(this.owner, this.server);
    testScenario(this.server);

    this.server.create('course-language-request', {
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ name: 'Python' }),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await animationsSettled();

    assert.notOk(coursePage.setupItem.hasRequestedLanguagesPrompt, 'does not requested languages prompt');
  });

  test('sees language prompt if subset of requested languages are still unsupported', async function (assert) {
    signIn(this.owner, this.server);
    testScenario(this.server);

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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await animationsSettled();

    assert.ok(coursePage.setupItem.hasRequestedLanguagesPrompt, 'has requested languages prompt');

    assert.equal(
      coursePage.setupItem.requestedLanguagesPrompt.willLetYouKnowText,
      "We'll let you know once Kotlin support is available on this challenge."
    );
  });
});
