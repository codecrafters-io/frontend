import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import applicationPage from 'codecrafters-frontend/tests/pages/application-page';
import demoPage from 'codecrafters-frontend/tests/pages/demo-page';

function setLocalStoragePreference(darkModeService, preference) {
  run(() => {
    darkModeService.localStoragePreference = preference;
  });
}

function setSystemPreference(darkModeService, preference) {
  run(() => {
    darkModeService.systemPreference = preference;
  });
}

module('Acceptance | demo page | dark-mode-toggle', function (hooks) {
  setupApplicationTest(hooks);

  test('it works', async function (assert) {
    await demoPage.demoTabs.darkModeToggle.visit();
    assert.strictEqual(currentURL(), '/demo/dark-mode-toggle', 'URL is correct');
    assert.ok(demoPage.demoTabs.darkModeToggle.component.isVisible, 'component has rendered');
  });

  test('it shows current localStorage preference', async function (assert) {
    await demoPage.demoTabs.darkModeToggle.visit();
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'null', 'localStorage preference is null by default');
    setLocalStoragePreference(this.owner.lookup('service:dark-mode'), 'system');
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'system', "localStorage preference is 'system'");
    setLocalStoragePreference(this.owner.lookup('service:dark-mode'), 'dark');
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'dark', "localStorage preference is 'dark'");
    setLocalStoragePreference(this.owner.lookup('service:dark-mode'), 'light');
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'light', "localStorage preference is 'light'");
  });

  test('it shows current system preference', async function (assert) {
    await demoPage.demoTabs.darkModeToggle.visit();
    setSystemPreference(this.owner.lookup('service:dark-mode'), 'light');
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentSystemPreference.text, 'light', "system preference is 'light'");
    setSystemPreference(this.owner.lookup('service:dark-mode'), 'dark');
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentSystemPreference.text, 'dark', "system preference is 'dark'");
  });

  test('it updates localStorage preference after clicking on mode-switching buttons', async function (assert) {
    await demoPage.demoTabs.darkModeToggle.visit();
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'null', 'localStorage preference is null by default');
    await demoPage.demoTabs.darkModeToggle.component.clickOnSystemOption();
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'system', "localStorage preference is 'system'");
    await demoPage.demoTabs.darkModeToggle.component.clickOnDarkOption();
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'dark', "localStorage preference is 'dark'");
    await demoPage.demoTabs.darkModeToggle.component.clickOnLightOption();
    assert.strictEqual(demoPage.demoTabs.darkModeToggle.currentLocalStoragePreference.text, 'light', "localStorage preference is 'light'");
  });

  test("it adds a '.dark' class to application container when Dark mode is active", async function (assert) {
    await demoPage.demoTabs.darkModeToggle.visit();
    assert.notOk(applicationPage.hasDarkClass, 'class .dark is absent by default');
    await demoPage.demoTabs.darkModeToggle.component.clickOnLightOption();
    assert.notOk(applicationPage.hasDarkClass, 'class .dark is absent when Light mode is selected');
    await demoPage.demoTabs.darkModeToggle.component.clickOnDarkOption();
    assert.ok(applicationPage.hasDarkClass, 'class .dark is present when Dark mode is selected');
    await demoPage.demoTabs.darkModeToggle.component.clickOnSystemOption();
    setSystemPreference(this.owner.lookup('service:dark-mode'), 'light');
    assert.notOk(applicationPage.hasDarkClass, 'class .dark is absent when System mode is selected & system preference is Light');
    setSystemPreference(this.owner.lookup('service:dark-mode'), 'dark');
    assert.ok(applicationPage.hasDarkClass, 'class .dark is present when System mode is selected & system preference is Dark');
  });
});
