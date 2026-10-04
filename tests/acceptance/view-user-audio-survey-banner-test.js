import { find, settled } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import window from 'ember-window-mock';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { module, test } from 'qunit';

module('Acceptance | view-user-audio-survey-banner', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(function () {
    for (const key of Object.keys(window.localStorage)) {
      if (key.includes('user-audio-survey-banner-dismissed')) {
        window.localStorage.removeItem(key);
      }
    }
  });

  test('it renders when the user is eligible', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    await catalogPage.visit();

    assert.true(catalogPage.userAudioSurveyBanner.isVisible);
    assert.false(catalogPage.productWalkthroughFeatureSuggestion.isVisible);

    await catalogPage.userAudioSurveyBanner.click();

    const inviteRequests = this.server.pretender.handledRequests.filter((request) => request.url.includes('audio-survey-invite'));
    assert.strictEqual(inviteRequests.length, 1);
  });

  test('dismissing it hides the banner', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    await catalogPage.visit();
    await catalogPage.userAudioSurveyBanner.clickOnDismissButton();

    assert.false(catalogPage.userAudioSurveyBanner.isVisible);

    await catalogPage.visit();

    assert.false(catalogPage.userAudioSurveyBanner.isVisible);
  });

  test('rapid clicks open one tab', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    await catalogPage.visit();

    const button = find('[data-test-user-audio-survey-banner-button]');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await settled();

    const inviteRequests = this.server.pretender.handledRequests.filter((request) => request.url.includes('audio-survey-invite'));
    assert.strictEqual(inviteRequests.length, 1);
  });

  test('it stays hidden when the user is not eligible', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();

    assert.false(catalogPage.userAudioSurveyBanner.isVisible);
  });
});
