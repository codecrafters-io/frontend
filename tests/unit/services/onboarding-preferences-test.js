import { module, test } from 'qunit';
import { stub } from 'sinon';
import { setupTest } from 'codecrafters-frontend/tests/helpers';

const preferences = { goal: '', role: 'Backend', experience: '10+', companySize: '', referralSurveyId: null };

module('Unit | Service | onboarding-preferences', function (hooks) {
  setupTest(hooks);

  // Verifies that personalization is restored for the signed-in user on a later load.
  test('restores stored preferences for the current user', function (assert) {
    // Arrange
    stub(this.owner.lookup('service:authenticator'), 'currentUserId').get(() => 'alice');
    this.owner.lookup('service:local-storage').setItem('onboarding-preferences:alice', JSON.stringify(preferences));

    // Act
    const result = this.owner.lookup('service:onboarding-preferences').preferences;

    // Assert
    assert.deepEqual(result, preferences);
  });

  // Verifies that another account cannot inherit the previous user's personalization.
  test('isolates preferences between accounts', function (assert) {
    // Arrange
    let userId = 'alice';
    stub(this.owner.lookup('service:authenticator'), 'currentUserId').get(() => userId);
    const service = this.owner.lookup('service:onboarding-preferences');
    service.save(preferences);

    // Act
    userId = 'bob';

    // Assert
    assert.strictEqual(service.preferences, null);
  });

  // Verifies that anonymous visitors do not inherit a signed-in user's preferences.
  test('clears personalization on sign-out', function (assert) {
    // Arrange
    let userId = 'alice';
    stub(this.owner.lookup('service:authenticator'), 'currentUserId').get(() => userId);
    const service = this.owner.lookup('service:onboarding-preferences');
    service.save(preferences);

    // Act
    userId = null;

    // Assert
    assert.strictEqual(service.preferences, null);
  });

  // Verifies that blocked browser storage still permits immediate personalization.
  test('keeps session preferences when browser storage fails', function (assert) {
    // Arrange
    stub(this.owner.lookup('service:authenticator'), 'currentUserId').get(() => 'alice');
    stub(this.owner.lookup('service:local-storage'), 'setItem').throws('Storage unavailable');
    const service = this.owner.lookup('service:onboarding-preferences');

    // Act
    service.save(preferences);

    // Assert
    assert.deepEqual(service.preferences, preferences);
  });

  // Verifies that damaged stored preferences do not break catalog browsing.
  test('ignores invalid stored preferences', function (assert) {
    // Arrange
    stub(this.owner.lookup('service:authenticator'), 'currentUserId').get(() => 'alice');
    this.owner.lookup('service:local-storage').setItem('onboarding-preferences:alice', 'invalid json');

    // Act
    const result = this.owner.lookup('service:onboarding-preferences').preferences;

    // Assert
    assert.strictEqual(result, null);
  });
});
