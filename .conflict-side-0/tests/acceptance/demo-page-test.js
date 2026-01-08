import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import demoPage from 'codecrafters-frontend/tests/pages/demo-page';

module('Acceptance | demo page', function (hooks) {
  setupApplicationTest(hooks);

  test('it works', async function (assert) {
    await demoPage.visit();
    assert.strictEqual(currentURL(), '/demo/code-mirror');
    assert.ok(demoPage.demoTabs.codeMirror.isVisible, 'CodeMirror tab is active by default');

    await demoPage.tabSwitcher.clickOnTab('DarkModeToggle');
    assert.ok(demoPage.demoTabs.darkModeToggle.component.isVisible, 'DarkModeToggle tab is visible');

    await demoPage.tabSwitcher.clickOnTab('FileContentsCard');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.isVisible, 'FileContentsCard tab is visible');

    await demoPage.tabSwitcher.clickOnTab('CodeMirror');
    assert.ok(demoPage.demoTabs.codeMirror.component.isVisible, 'CodeMirror tab is visible');
  });
});
