import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | forum-link-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('forum link in account dropdown redirects to forum', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    window.open = (urlToOpen) => {
      assert.strictEqual(urlToOpen, 'https://forum.codecrafters.io/', 'should redirect to forum');
    };

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Forum');
  });
});
