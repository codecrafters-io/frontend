import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import welcomePage from 'codecrafters-frontend/tests/pages/welcome-page';
import windowMock from 'ember-window-mock';
import { click, currentURL, fillIn, find, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { Response } from 'miragejs';
import { stub } from 'sinon';

function createSurvey(context) {
  testScenario(context.server);
  const user = signIn(context.owner, context.server);

  return context.server.create('onboarding-survey', { user, status: 'incomplete' });
}

async function showProfile(goal = 'Understand how systems work') {
  await welcomePage.visit();
  if (goal) await click(`[data-test-goal="${goal}"]`);
  await click('[data-test-continue-button]');
}

function profileEvents(server) {
  return server.schema.analyticsEvents.all().models.filter((event) => event.name === 'submitted_onboarding_profile');
}

module('Acceptance | onboarding-survey-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  // Verifies that choosing a new goal replaces and saves the previous choice.
  test('saves one primary goal before advancing', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="Master a language"]');

    // Act
    await click('[data-test-goal="Understand how systems work"]');
    await click('[data-test-continue-button]');

    // Assert
    assert.deepEqual(survey.selectedOptionsForUsagePurpose, ['Understand how systems work']);
    assert.dom('[data-test-step-progress]').hasText('2 of 2');
    assert.dom('#onboarding-about-heading').isFocused();
  });

  // Verifies that skipping a selected goal clears it rather than fabricating an answer.
  test('can skip the goal question', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="Master a language"]');

    // Act
    await click('[data-test-skip-goal]');

    // Assert
    assert.deepEqual(survey.selectedOptionsForUsagePurpose, []);
    assert.dom('[data-test-step-progress]').hasText('2 of 2');
  });

  // Verifies that a custom goal survives navigation back to the first screen.
  test('preserves a custom goal', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit();
    await click('[data-test-goal="other"]');
    await fillIn('[data-test-goal-text]', 'Practice networking');
    await click('[data-test-continue-button]');

    // Act
    await click('[data-test-back]');

    // Assert
    assert.dom('[data-test-goal-text]').hasValue('Practice networking');
  });

  // Verifies that an incomplete profile can be applied without mandatory background questions.
  test('accepts a partial profile', async function (assert) {
    // Arrange
    createSurvey(this);
    await showProfile(null);
    await click('[data-test-role="Other"]');

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
    assert.propContains(profileEvents(this.server)[0].properties, { role: 'Other', professional_programming_years: null });
  });

  // Verifies that Back preserves the selected role, experience, and company size.
  test('preserves profile answers when navigating back', async function (assert) {
    // Arrange
    createSurvey(this);
    await showProfile();
    await click('[data-test-role="Backend"]');
    await click('[data-test-experience="2\u20135"]');
    await click('[data-test-company-size="51\u2013500"]');

    // Act
    await click('[data-test-back]');
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-role="Backend"] input').isChecked();
    assert.dom('[data-test-experience="2\u20135"] input').isChecked();
    assert.dom('[data-test-company-size="51\u2013500"] input').isChecked();
  });

  // Verifies that completion saves structured answers before applying catalog personalization.
  test('saves profile answers and opens the personalized catalog', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showProfile('Build portfolio projects');
    await click('[data-test-role="Backend"]');
    await click('[data-test-experience="2\u20135"]');
    await click('[data-test-company-size="51\u2013500"]');

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.strictEqual(survey.status, 'complete');
    assert.strictEqual(currentURL(), '/catalog');
    assert.dom('[data-test-recommendation]').includesText('Build your own Git');
    assert.dom('[data-test-course-name]').hasText('Build your own Git');
    assert.propContains(profileEvents(this.server)[0].properties, {
      role: 'Backend',
      professional_programming_years: '2\u20135',
      company_size: '51\u2013500',
      profile_skipped: false,
    });
  });

  // Verifies that role changes the recommendation when no specific goal is supplied.
  test('uses role to recommend a relevant challenge', async function (assert) {
    // Arrange
    createSurvey(this);
    await showProfile(null);
    await click('[data-test-role="ML or Data"]');

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-recommendation]').includesText('Build your own SQLite');
  });

  // Verifies that experienced developers can reveal the same guidance on demand.
  test('collapses starting guidance for experienced developers', async function (assert) {
    // Arrange
    createSurvey(this);
    await showProfile();
    await click('[data-test-experience="10+"]');
    await click('[data-test-continue-button]');

    // Act
    await click('[data-test-starting-guidance] summary');

    // Assert
    assert.dom('[data-test-starting-guidance]').hasAttribute('open');
  });

  // Verifies that opting to pick independently discards partially entered personalization.
  test('can skip personalization and use the default catalog', async function (assert) {
    // Arrange
    createSurvey(this);
    await showProfile('Build portfolio projects');
    await click('[data-test-role="Backend"]');

    // Act
    await click('[data-test-skip-profile]');

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
    assert.dom('[data-test-recommendation]').doesNotExist();
    assert.propContains(profileEvents(this.server)[0].properties, { role: null, professional_programming_years: null, profile_skipped: true });
  });

  // Verifies that referral is collected independently after the recommendation is visible.
  test('saves the optional referral answer from the catalog', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showProfile();
    await click('[data-test-continue-button]');
    await click('[data-test-referral-toggle]');
    await click('[data-test-referral="Other"]');
    await fillIn('[data-test-other-referral]', 'A newsletter');

    // Act
    await click('[data-test-save-referral]');

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
    assert.deepEqual(survey.selectedOptionsForReferralSource, ['Other']);
    assert.strictEqual(survey.freeFormAnswerForReferralSource, 'A newsletter');
    assert.dom('[data-test-recommendation]').exists();
  });

  // Verifies that a failed referral save preserves the answer and permits retry.
  test('can retry the optional referral save', async function (assert) {
    // Arrange
    createSurvey(this);
    await showProfile();
    await click('[data-test-continue-button]');
    await click('[data-test-referral-toggle]');
    await click('[data-test-referral="GitHub"]');
    this.server.patch('/onboarding-surveys/:id', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-save-referral]');

    // Assert
    assert.dom('[data-test-referral-error]').exists();
    assert.dom('[data-test-save-referral]').isNotDisabled();
    assert.dom('[data-test-referral="GitHub"] input').isChecked();

    // Act
    this.server.patch('/onboarding-surveys/:id');
    await click('[data-test-save-referral]');

    // Assert
    assert.dom('[data-test-referral-error]').doesNotExist();
  });

  // Verifies that failed goal storage leaves the first screen available for retry.
  test('can retry a failed goal save', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit();
    this.server.patch('/onboarding-surveys/:id', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-save-error]').exists();
    assert.dom('[data-test-step-progress]').hasText('1 of 2');

    // Act
    this.server.patch('/onboarding-surveys/:id');
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-step-progress]').hasText('2 of 2');
  });

  // Verifies that a completion retry does not duplicate the saved analytics event.
  test('can retry completion without duplicating the profile', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showProfile();
    this.server.patch('/onboarding-surveys/:id', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.dom('[data-test-save-error]').exists();
    assert.strictEqual(survey.status, 'incomplete');
    assert.strictEqual(profileEvents(this.server).length, 1);

    // Act
    this.server.patch('/onboarding-surveys/:id');
    await click('[data-test-continue-button]');

    // Assert
    assert.strictEqual(survey.status, 'complete');
    assert.strictEqual(profileEvents(this.server).length, 1);
  });

  // Verifies that failed analytics storage prevents premature onboarding completion.
  test('can retry a failed profile save', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showProfile();
    this.server.post('/analytics-events', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.strictEqual(survey.status, 'incomplete');
    assert.dom('[data-test-save-error]').exists();

    // Act
    this.server.post('/analytics-events');
    await click('[data-test-continue-button]');

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
  });

  // Verifies that repeated clicks cannot create a second pending completion save.
  test('prevents duplicate submissions while saving', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    await showProfile();
    const record = this.owner.lookup('service:store').peekRecord('onboarding-survey', survey.id);
    const originalSave = record.save.bind(record);
    let finishSave;
    const gate = new Promise((resolve) => {
      finishSave = resolve;
    });
    const saveStub = stub(record, 'save').callsFake(() => gate.then(originalSave));

    // Act
    const clickPromise = click('[data-test-continue-button]');
    await waitUntil(() => saveStub.calledOnce);
    find('[data-test-continue-button]').click();

    // Assert
    assert.dom('[data-test-continue-button]').isDisabled();
    assert.dom('[data-test-skip-profile]').isDisabled();
    assert.strictEqual(saveStub.callCount, 1);

    // Act
    finishSave();
    await clickPromise;

    // Assert
    assert.strictEqual(survey.status, 'complete');
  });

  // Verifies that completion returns users to their original signup destination.
  test('preserves the original destination', async function (assert) {
    // Arrange
    createSurvey(this);
    await welcomePage.visit({ next: 'https://localhost:1234/refer' });
    await click('[data-test-continue-button]');

    // Act
    await click('[data-test-continue-button]');

    // Assert
    assert.strictEqual(windowMock.location.href, 'https://localhost:1234/refer');
  });

  // Verifies that completed surveys are not shown a second time.
  test('redirects completed surveys to catalog', async function (assert) {
    // Arrange
    const survey = createSurvey(this);
    survey.update({ status: 'complete' });

    // Act
    await welcomePage.visit();

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
  });
});
