import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { Response } from 'miragejs';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

function createEligibleUser(context, status = 'complete') {
  testScenario(context.server);
  const user = signIn(context.owner, context.server);
  const suggestion = context.server.create('feature-suggestion', { user, featureSlug: 'onboarding-profile-v1', dismissedAt: null });
  const survey = status ? context.server.create('onboarding-survey', { user, status }) : null;

  return { user, suggestion, survey };
}

function profileEvents(server) {
  return server.schema.analyticsEvents.all().models.filter((event) => event.name === 'submitted_onboarding_profile');
}

async function fillProfile() {
  await visit('/catalog');
  await click('[data-test-open-profile]');
  await click('[data-test-profile-role="Backend"]');
  await click('[data-test-profile-experience="2\u20135"]');
}

module('Acceptance | catalog-profile-prompt', function (hooks) {
  setupApplicationTest(hooks);

  // Verifies that eligibility comes from the server rather than account age or missing survey fields.
  test('does not prompt an account without a server invitation', async function (assert) {
    // Arrange
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    this.server.create('onboarding-survey', { user, status: 'complete' });

    // Act
    await visit('/catalog');

    // Assert
    assert.dom('[data-test-profile-prompt]').doesNotExist();
  });

  // Verifies that anonymous browsing keeps the existing catalog experience.
  test('does not prompt anonymous visitors', async function (assert) {
    // Arrange
    testScenario(this.server);

    // Act
    await visit('/catalog');

    // Assert
    assert.dom('[data-test-profile-prompt]').doesNotExist();
    assert.dom('[data-test-product-walkthrough-feature-suggestion]').exists();
  });

  // Verifies that an unavailable optional survey does not block the catalog.
  test('keeps the catalog available when the survey lookup fails', async function (assert) {
    // Arrange
    createEligibleUser(this);
    this.server.get('/onboarding-surveys', () => new Response(500, {}, {}));

    // Act
    await visit('/catalog');

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
    assert.dom('[data-test-profile-prompt]').doesNotExist();
    assert.dom('h1').hasText('Challenges');
  });

  // Verifies that a returning user supplies only missing background information.
  test('saves a short profile without repeating the original onboarding', async function (assert) {
    // Arrange
    const { survey, suggestion } = createEligibleUser(this);
    await fillProfile();
    await click('[data-test-profile-role="Full-stack"]');
    await click('[data-test-profile-company="51\u2013500"]');

    // Act
    await click('[data-test-save-profile]');

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
    assert.dom('[data-test-profile-prompt]').doesNotExist();
    assert.ok(suggestion.dismissedAt);
    assert.strictEqual(survey.status, 'complete');
    assert.propContains(profileEvents(this.server)[0].properties, {
      schema_version: 1,
      source: 'catalog_profile_prompt',
      feature_suggestion_id: suggestion.id,
      role: 'Full-stack',
      professional_programming_years: '2\u20135',
      company_size: '51\u2013500',
    });
  });

  // Verifies that accounts predating the old survey can still share their background.
  test('supports users without an original survey', async function (assert) {
    // Arrange
    createEligibleUser(this, null);
    await fillProfile();

    // Act
    await click('[data-test-save-profile]');

    // Assert
    assert.dom('[data-test-profile-prompt]').doesNotExist();
    assert.propContains(profileEvents(this.server)[0].properties, { onboarding_survey_id: null, company_size: null });
  });

  // Verifies that optional background fields do not block personalization.
  test('accepts a partial profile', async function (assert) {
    // Arrange
    createEligibleUser(this);
    await visit('/catalog');
    await click('[data-test-open-profile]');

    // Act
    await click('[data-test-profile-role="Other"]');
    await click('[data-test-profile-experience="<2"]');
    await fillIn('[data-test-profile-other-role]', '   ');

    // Assert
    assert.dom('[data-test-save-profile]').isNotDisabled();

    // Act
    await fillIn('[data-test-profile-other-role]', 'DevOps engineer');
    await click('[data-test-save-profile]');

    // Assert
    assert.propContains(profileEvents(this.server)[0].properties, { role: 'Other', role_other: 'DevOps engineer' });
  });

  // Verifies that opting out is saved on the server and survives another current-user fetch.
  test('does not show a dismissed invitation on a later visit', async function (assert) {
    // Arrange
    const { suggestion } = createEligibleUser(this);
    await visit('/catalog');

    // Act
    await click('[data-test-dismiss-profile]');
    await this.owner.lookup('service:authenticator').syncCurrentUser();
    await visit('/catalog');

    // Assert
    assert.ok(suggestion.dismissedAt);
    assert.dom('[data-test-profile-prompt]').doesNotExist();
    assert.strictEqual(profileEvents(this.server).length, 0);
  });

  // Verifies that a failed dismissal remains visible and can be retried.
  test('can retry a failed dismissal', async function (assert) {
    // Arrange
    const { suggestion } = createEligibleUser(this);
    this.server.patch('/feature-suggestions/:id', () => new Response(500, {}, {}));
    await visit('/catalog');

    // Act
    await click('[data-test-dismiss-profile]');

    // Assert
    assert.dom('[data-test-profile-error]').hasText('This could not be dismissed. Please try again.');
    assert.notOk(suggestion.dismissedAt);

    // Act
    this.server.patch('/feature-suggestions/:id');
    await click('[data-test-dismiss-profile]');

    // Assert
    assert.dom('[data-test-profile-prompt]').doesNotExist();
  });

  // Verifies that failed answer storage preserves the selected answers and invitation.
  test('can retry a failed profile save', async function (assert) {
    // Arrange
    const { suggestion } = createEligibleUser(this);
    await fillProfile();
    this.server.post('/analytics-events', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-save-profile]');

    // Assert
    assert.dom('[data-test-profile-error]').exists();
    assert.dom('[data-test-profile-role="Backend"] input').isChecked();
    assert.dom('[data-test-profile-experience="2\u20135"] input').isChecked();
    assert.notOk(suggestion.dismissedAt);

    // Act
    this.server.post('/analytics-events');
    await click('[data-test-save-profile]');

    // Assert
    assert.dom('[data-test-profile-prompt]').doesNotExist();
    assert.strictEqual(profileEvents(this.server).length, 1);
  });

  // Verifies that retrying completion does not resend answers already saved successfully.
  test('does not duplicate answers when invitation dismissal fails', async function (assert) {
    // Arrange
    createEligibleUser(this);
    await fillProfile();
    this.server.patch('/feature-suggestions/:id', () => new Response(500, {}, {}));

    // Act
    await click('[data-test-save-profile]');
    this.server.patch('/feature-suggestions/:id');
    await click('[data-test-save-profile]');

    // Assert
    assert.dom('[data-test-profile-prompt]').doesNotExist();
    assert.strictEqual(profileEvents(this.server).length, 1);
  });

  // Verifies that unfinished onboarding is offered without forcing a redirect.
  test('invites an unfinished user to resume setup', async function (assert) {
    // Arrange
    createEligibleUser(this, 'incomplete');
    await visit('/catalog');

    // Act
    await click('[data-test-resume-onboarding]');

    // Assert
    assert.strictEqual(currentURL(), '/welcome');
    assert.dom('[data-test-onboarding-survey-wizard]').exists();
  });

  // Verifies that finishing the invited flow resolves its catalog invitation too.
  test('finishing resumed onboarding removes the invitation', async function (assert) {
    // Arrange
    const { suggestion } = createEligibleUser(this, 'incomplete');
    await visit('/catalog');
    await click('[data-test-resume-onboarding]');
    await click('[data-test-goal="Master a language"]');
    await click('[data-test-continue-button]');

    // Act
    await click('[data-test-skip-profile]');

    // Assert
    assert.strictEqual(currentURL(), '/catalog');
    assert.ok(suggestion.dismissedAt);
    assert.dom('[data-test-profile-prompt]').doesNotExist();
  });

  // Verifies that a challenge link remains the destination for an eligible returning user.
  test('does not interrupt challenge deep links', async function (assert) {
    // Arrange
    createEligibleUser(this);

    // Act
    await visit('/courses/redis/overview');

    // Assert
    assert.strictEqual(currentURL(), '/courses/redis/overview');
    assert.dom('[data-test-profile-prompt]').doesNotExist();
  });

  // Verifies that existing promotional banners do not compete with the profile invitation.
  test('shows one catalog prompt at a time', async function (assert) {
    // Arrange
    const { user } = createEligibleUser(this);
    user.update({ showUserAudioSurveyBanner: true });
    this.server.create('feature-suggestion', { user, featureSlug: 'product-walkthrough', dismissedAt: null });

    // Act
    await visit('/catalog');

    // Assert
    assert.dom('[data-test-profile-prompt]').exists();
    assert.dom('[data-test-product-walkthrough-feature-suggestion]').doesNotExist();
    assert.dom('[data-test-user-audio-survey-banner]').doesNotExist();
  });
  // Verifies that the returning-user answer visibly changes the recommendation.
  test('personalizes the catalog after saving a returning profile', async function (assert) {
    // Arrange
    createEligibleUser(this);
    await fillProfile();
    await click('[data-test-profile-role="ML or Data"]');

    // Act
    await click('[data-test-save-profile]');

    // Assert
    assert.dom('[data-test-recommendation]').includesText('Build your own SQLite');
  });

  // Verifies that preferences remain editable after the original invitation has been dismissed.
  test('edits preferences without requiring another invitation', async function (assert) {
    // Arrange
    createEligibleUser(this);
    await fillProfile();
    await click('[data-test-save-profile]');
    await click('[data-test-edit-preferences]');
    await click('[data-test-profile-role="ML or Data"]');

    // Act
    await click('[data-test-save-profile]');

    // Assert
    assert.dom('[data-test-recommendation]').includesText('Build your own SQLite');
    assert.strictEqual(profileEvents(this.server)[1].properties.source, 'catalog_preferences');
  });

  // Verifies that clearing a saved role removes it from the applied profile.
  test('can clear an individual preference', async function (assert) {
    // Arrange
    createEligibleUser(this);
    await fillProfile();
    await click('[data-test-save-profile]');
    await click('[data-test-edit-preferences]');

    // Act
    await click('[data-test-clear-profile-role]');
    await click('[data-test-save-profile]');

    // Assert
    assert.strictEqual(profileEvents(this.server)[1].properties.role, null);
  });
  // Verifies that clearing an old goal does not restore it when preferences reopen.
  test('preserves an explicitly cleared goal', async function (assert) {
    // Arrange
    const { survey } = createEligibleUser(this);
    survey.update({ selectedOptionsForUsagePurpose: ['Build portfolio projects'] });
    await fillProfile();
    await click('[data-test-save-profile]');
    await click('[data-test-edit-preferences]');
    await click('input[name="catalog-profile-goal"][value=""]');
    await click('[data-test-save-profile]');

    // Act
    await click('[data-test-edit-preferences]');

    // Assert
    assert.dom('input[name="catalog-profile-goal"][value=""]').isChecked();
  });
});
