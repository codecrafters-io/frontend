import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import welcomePage from 'codecrafters-frontend/tests/pages/welcome-page';
import windowMock from 'ember-window-mock';
import { click, currentURL, fillIn, find, select, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { Response } from 'miragejs';
import { stub } from 'sinon';
import percySnapshot from '@percy/ember';

function createSurvey(context) {
  testScenario(context.server);
  const user = signIn(context.owner, context.server);

  return context.server.create('onboarding-survey', { user, status: 'incomplete' });
}

async function showSuggestion(goal = 'Understand how systems work') {
  await welcomePage.visit();
  await click(`[data-test-goal="${goal}"]`);
  await click('[data-test-continue-button]');
  await click('[data-test-skip-profile]');
}

function profileEvents(server) {
  return server.schema.analyticsEvents.all().models.filter((event) => event.name === 'submitted_onboarding_profile');
}

module('Acceptance | onboarding-survey-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  // Verifies that choosing a new goal replaces the previous choice and saves it.
  test('saves one primary goal before advancing', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await welcomePage.visit();
    await percySnapshot('Onboarding - Your Goal');

    // Act
    await click('[data-test-goal="Master a language"]');
    await click('[data-test-goal="Understand how systems work"]');
    await click('[data-test-continue-button]');

    // Assert
    assert.deepEqual(survey.selectedOptionsForUsagePurpose, ['Understand how systems work']);
    assert.dom('[data-test-step-progress]').hasText('2 of 3');
    assert.dom('#onboarding-about-heading').isFocused();
  });

  // Verifies that a custom goal needs meaningful text before advancing.
  test('requires a goal or a nonblank custom answer', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit();

    // Act
    await click('[data-test-goal="other"]');
    await fillIn('[data-test-goal-text]', '   ');

    // Assert
    assert.dom('[data-test-continue-button]').isDisabled();

    // Act
    await fillIn('[data-test-goal-text]', 'Learn networking');
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-step-progress]').hasText('2 of 3');
  });

  // Verifies that profile validation includes a description for an Other role.
  test('requires role and experience unless the profile is skipped', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="Master a language"]');
    await click('[data-test-continue-button]');

    // Act
    await click('[data-test-role="Other"]');
    await click('[data-test-experience="<2"]');

    // Assert
    assert.dom('[data-test-continue-button]').isDisabled();

    // Act
    await fillIn('[data-test-other-role]', 'DevOps engineer');

    // Assert
    assert.dom('[data-test-continue-button]').isNotDisabled();
  });

  // Verifies that Back preserves the previously entered profile answers.
  test('preserves profile answers when navigating back', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="Master a language"]');
    await click('[data-test-continue-button]');
    await click('[data-test-role="Backend"]');
    await click('[data-test-experience="2\u20135"]');
    await click('[data-test-company-disclosure] button');
    await select('[data-test-company-size]', '51\u2013500');
    await click('[data-test-continue-button]');

    // Act
    await click('[data-test-back]');

    // Assert
    assert.dom('[data-test-role="Backend"] input').isChecked();
    assert.dom('[data-test-experience="2\u20135"] input').isChecked();
    assert.dom('[data-test-company-size]').hasValue('51\u2013500');
  });

  // Verifies that the full profile and optional referral answer reach the server.
  test('persists structured profile answers and completes onboarding', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="Understand how systems work"]');
    await click('[data-test-continue-button]');
    await click('[data-test-role="Backend"]');
    await click('[data-test-experience="2\u20135"]');
    await click('[data-test-company-disclosure] button');
    await select('[data-test-company-size]', '51\u2013500');
    await percySnapshot('Onboarding - About You');
    await click('[data-test-continue-button]');
    await click('[data-test-referral-disclosure] button');
    await click('[data-test-referral="Other"]');
    await fillIn('[data-test-other-referral]', 'A newsletter');
    await percySnapshot('Onboarding - First Build');

    // Act
    await click('[data-test-browse-challenges]');

    // Assert
    assert.strictEqual(survey.status, 'complete');
    assert.deepEqual(survey.selectedOptionsForReferralSource, ['Other']);
    assert.strictEqual(survey.freeFormAnswerForReferralSource, 'A newsletter');
    assert.strictEqual(currentURL(), '/catalog');
    assert.strictEqual(profileEvents(this.server).length, 1);
    assert.propContains(profileEvents(this.server)[0].properties, {
      onboarding_survey_id: survey.id,
      role: 'Backend',
      professional_programming_years: '2\u20135',
      company_size: '51\u2013500',
      profile_skipped: false,
      referral_source_other: 'A newsletter',
    });
  });

  // Verifies that skipping does not record a partially entered profile as complete.
  test('can skip the profile and referral questions', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="Master a language"]');
    await click('[data-test-continue-button]');
    await click('[data-test-role="Backend"]');

    // Act
    await click('[data-test-skip-profile]');
    await click('[data-test-browse-challenges]');

    // Assert
    assert.propContains(profileEvents(this.server)[0].properties, {
      role: null,
      professional_programming_years: null,
      profile_skipped: true,
      referral_source: null,
    });
    assert.strictEqual(currentURL(), '/catalog');
  });

  // Verifies that a portfolio goal leads into the suggested Git challenge.
  test('starts the challenge suggested for the selected goal', async function (assert) {
    // Arrange
    createSurvey(this);
    await showSuggestion('Build portfolio projects');
    assert.dom('[data-test-recommendation]').includesText('Build your own Git');

    // Act
    await click('[data-test-start-building]');

    // Assert
    assert.strictEqual(currentURL(), '/courses/git/overview');
  });

  // Verifies that suggestions use an available challenge when the preferred one is absent.
  test('suggests an available course when the preferred course is unavailable', async function (assert) {
    // Arrange
    createSurvey(this);

    // Act
    await showSuggestion('Pick up a new language');

    // Assert
    assert.dom('[data-test-recommendation]').includesText('Build your own Redis');
  });

  // Verifies that a failed goal save leaves the user able to retry.
  test('can retry a failed goal save', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="Master a language"]');
    this.server.patch('/onboarding-surveys/:id', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-save-error]').exists();
    assert.dom('[data-test-continue-button]').isNotDisabled();
    assert.dom('[data-test-step-progress]').hasText('1 of 3');

    // Act
    this.server.patch('/onboarding-surveys/:id');
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-step-progress]').hasText('2 of 3');
  });

  // Verifies that final-save retry does not duplicate an already saved profile event.
  test('can retry a failed final survey save without duplicating the profile', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showSuggestion();
    this.server.patch('/onboarding-surveys/:id', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-browse-challenges]');

    // Assert
    assert.dom('[data-test-save-error]').exists();
    assert.dom('[data-test-browse-challenges]').isNotDisabled();
    assert.strictEqual(profileEvents(this.server).length, 1);
    assert.strictEqual(survey.status, 'incomplete');

    // Act
    this.server.patch('/onboarding-surveys/:id');
    await click('[data-test-browse-challenges]');

    // Assert
    assert.strictEqual(survey.status, 'complete');
    assert.strictEqual(profileEvents(this.server).length, 1);
    assert.strictEqual(currentURL(), '/catalog');
  });

  // Verifies that an unsuccessful profile save prevents premature completion.
  test('can retry a failed structured profile save', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showSuggestion();
    this.server.post('/analytics-events', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-browse-challenges]');

    // Assert
    assert.strictEqual(survey.status, 'incomplete');
    assert.dom('[data-test-save-error]').exists();
    assert.strictEqual(currentURL(), '/welcome');

    // Act
    this.server.post('/analytics-events');
    await click('[data-test-browse-challenges]');

    // Assert
    assert.strictEqual(survey.status, 'complete');
    assert.strictEqual(profileEvents(this.server).length, 1);
    assert.strictEqual(currentURL(), '/catalog');
  });

  // Verifies that repeated clicks cannot submit a second final save while one is pending.
  test('prevents duplicate submissions while saving', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showSuggestion();
    const record = this.owner.lookup('service:store').peekRecord('onboarding-survey', survey.id);
    const originalSave = record.save.bind(record);
    let finishSave;
    const gate = new Promise((resolve) => {
      finishSave = resolve;
    });
    const saveStub = stub(record, 'save').callsFake(() => gate.then(originalSave));

    // Act
    const clickPromise = click('[data-test-start-building]');
    await waitUntil(() => saveStub.calledOnce);
    find('[data-test-start-building]').click();

    // Assert
    assert.dom('[data-test-start-building]').isDisabled();
    assert.dom('[data-test-browse-challenges]').isDisabled();
    assert.strictEqual(saveStub.callCount, 1);

    // Act
    finishSave();
    await clickPromise;

    // Assert
    assert.strictEqual(survey.status, 'complete');
  });

  // Verifies that onboarding completion preserves the original post-signup destination.
  test('returns to the original destination after completion', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit({ next: 'https://localhost:1234/refer' });
    await click('[data-test-goal="Master a language"]');
    await click('[data-test-continue-button]');
    await click('[data-test-skip-profile]');
    assert.dom('[data-test-start-building]').includesText('Continue where you left off');

    // Act
    await click('[data-test-start-building]');

    // Assert
    assert.strictEqual(windowMock.location.href, 'https://localhost:1234/refer');
  });

  // Verifies that an account without an onboarding survey can still access the catalog.
  test('redirects to catalog if no survey is found', async function (assert) {
    // Arrange
    testScenario(this.server);
    signIn(this.owner, this.server);

    // Act
    await welcomePage.visit();

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
  });

  // Verifies that an already completed survey is not shown again.
  test('redirects to catalog if the survey is complete', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    survey.update({ status: 'complete' });

    // Act
    await welcomePage.visit();

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
  });
});
