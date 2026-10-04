import { find, settled, waitUntil } from '@ember/test-helpers';
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

    const openedUrls = [];

    window.open = (urlToOpen) => {
      openedUrls.push(urlToOpen);
    };

    await catalogPage.visit();

    assert.true(catalogPage.userAudioSurveyBanner.isVisible);
    assert.false(catalogPage.productWalkthroughFeatureSuggestion.isVisible);

    await catalogPage.userAudioSurveyBanner.click();
    await waitUntil(() => openedUrls.length === 1);

    const inviteRequests = this.server.pretender.handledRequests.filter((request) => request.url.includes('audio-survey-invite'));
    assert.strictEqual(inviteRequests.length, 1);
    assert.strictEqual(openedUrls[0], 'https://example.com/audio-survey-invite');
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

  test('it does not open a tab when the invite response has no url', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    this.server.post('/users/:id/audio-survey-invite', () => {
      return { url: null };
    });

    const openedUrls = [];

    window.open = () => {
      openedUrls.push(true);
    };

    const controller = this.owner.lookup('controller:catalog');

    await catalogPage.visit();
    await catalogPage.userAudioSurveyBanner.click();
    await waitUntil(() => controller.isCreatingAudioSurveyInvite === false);

    assert.strictEqual(openedUrls.length, 0);
  });

  test('it ignores a dismiss when nobody is signed in', function (assert) {
    testScenario(this.server);

    const authenticator = this.owner.lookup('service:authenticator');
    const controller = this.owner.lookup('controller:catalog');

    assert.strictEqual(authenticator.currentUser, null);

    controller.dismissAudioSurveyBanner();

    const dismissedKeys = Object.keys(window.localStorage).filter((key) => key.includes('user-audio-survey-banner-dismissed'));

    assert.strictEqual(controller.audioSurveyBannerDismissedForUserId, null);
    assert.strictEqual(dismissedKeys.length, 0);
  });

  test('it stays hidden when the user is not eligible', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();

    assert.false(catalogPage.userAudioSurveyBanner.isVisible);
  });
});
