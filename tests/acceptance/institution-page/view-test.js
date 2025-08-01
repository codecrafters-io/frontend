import institutionPage from 'codecrafters-frontend/tests/pages/institution-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import createInstitution from 'codecrafters-frontend/mirage/utils/create-institution';

module('Acceptance | institution-page | view-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('can view institution page as unauthenticated user', async function (assert) {
    testScenario(this.server);
    createInstitution(this.server, 'nus');

    await institutionPage.visit({ institution_slug: 'nus' });
    assert.strictEqual(currentURL(), '/institutions/nus');

    await percySnapshot('Institution Page - Unauthenticated');
  });

  // TODO: Test unauthenticated user flows:
  //   - Hovering on the claim offer button should reveal a tooltip with the text "Click to login via GitHub"
  //   - Clicking on the claim offer button should redirect the user to the login page
  //
  // TODO: Test member/VIP flow:
  //   - Hovering on the claim offer button should reveal a tooltip with the text "As a CodeCrafters member, you already have full access."
  //   - Clicking on the claim offer button should do nothing
  //
  // TODO: Test that visiting an invalid institution slug redirects to 404
  //
  // TODO: Test user with grant flow (behaviour TBD)
});
