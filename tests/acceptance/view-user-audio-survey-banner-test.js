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

  function createFakeSurveyTab() {
    return {
      closed: false,
      location: { href: '' },
      opener: {},

      close() {
        this.closed = true;
      },
    };
  }

  test('it renders when the user is eligible', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    const openedTabs = [];

    window.open = (urlToOpen, target) => {
      const surveyTab = createFakeSurveyTab();

      openedTabs.push({ surveyTab, target, urlToOpen });

      return surveyTab;
    };

    this.server.post('/users/:id/audio-survey-invite', () => {
      assert.strictEqual(openedTabs.length, 1, 'survey tab opens before the invite request returns');
      assert.strictEqual(openedTabs[0].urlToOpen, '');
      assert.strictEqual(openedTabs[0].target, '_blank');

      return { url: 'https://example.com/audio-survey-invite' };
    });

    await catalogPage.visit();

    assert.true(catalogPage.userAudioSurveyBanner.isVisible);
    assert.false(catalogPage.productWalkthroughFeatureSuggestion.isVisible);

    await catalogPage.userAudioSurveyBanner.click();
    await waitUntil(() => openedTabs[0].surveyTab.location.href === 'https://example.com/audio-survey-invite');

    const inviteRequests = this.server.pretender.handledRequests.filter((request) => request.url.includes('audio-survey-invite'));
    assert.strictEqual(inviteRequests.length, 1);
    assert.strictEqual(openedTabs[0].surveyTab.opener, null);
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

    window.open = () => createFakeSurveyTab();

    await catalogPage.visit();

    const button = find('[data-test-user-audio-survey-banner-button]');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await settled();

    const inviteRequests = this.server.pretender.handledRequests.filter((request) => request.url.includes('audio-survey-invite'));
    assert.strictEqual(inviteRequests.length, 1);
  });

  test('it closes the survey tab when the invite response has no url', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    this.server.post('/users/:id/audio-survey-invite', () => {
      return { url: null };
    });

    const openedTabs = [];

    window.open = () => {
      const surveyTab = createFakeSurveyTab();

      openedTabs.push(surveyTab);

      return surveyTab;
    };

    const controller = this.owner.lookup('controller:catalog');

    await catalogPage.visit();
    await catalogPage.userAudioSurveyBanner.click();
    await waitUntil(() => openedTabs[0]?.closed === true);

    assert.strictEqual(openedTabs.length, 1);
    assert.false(controller.isCreatingAudioSurveyInvite);
    assert.strictEqual(openedTabs[0].location.href, '');
  });

  test('it stays on the catalog when the survey tab is closed before the invite returns', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    const assignedUrls = [];
    let surveyTab;

    window.open = () => {
      surveyTab = createFakeSurveyTab();

      return surveyTab;
    };

    window.location.assign = (url) => {
      assignedUrls.push(url);
    };

    this.server.post('/users/:id/audio-survey-invite', () => {
      surveyTab.close();

      return { url: 'https://example.com/audio-survey-invite' };
    });

    await catalogPage.visit();
    await catalogPage.userAudioSurveyBanner.click();
    await settled();

    assert.strictEqual(assignedUrls.length, 0);
    assert.strictEqual(surveyTab.location.href, '');
    assert.true(surveyTab.closed);
  });

  test('it opens the survey in the current tab when the new tab is blocked', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);
    user.update({ showUserAudioSurveyBanner: true });

    const assignedUrls = [];

    window.open = () => null;

    window.location.assign = (url) => {
      assignedUrls.push(url);
    };

    await catalogPage.visit();
    await catalogPage.userAudioSurveyBanner.click();
    await waitUntil(() => assignedUrls.length === 1);

    assert.strictEqual(assignedUrls[0], 'https://example.com/audio-survey-invite');
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
