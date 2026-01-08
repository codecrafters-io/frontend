import institutionPage from 'codecrafters-frontend/tests/pages/institution-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsInstitutionMembershipGrantRecipient } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createInstitution from 'codecrafters-frontend/mirage/utils/create-institution';

module('Acceptance | institution-page | view-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('can view institution page as unauthenticated user', async function (assert) {
    testScenario(this.server);
    createInstitution(this.server, 'nus');

    await institutionPage.visit({ institution_slug: 'nus' });
    assert.strictEqual(currentURL(), '/campus/nus');

    await percySnapshot('Institution Page - Unauthenticated');
  });

  test('can view institution page as user with active grant', async function (assert) {
    testScenario(this.server);
    const institution = createInstitution(this.server, 'nus');
    const user = signInAsInstitutionMembershipGrantRecipient(this.owner, this.server);

    this.server.create('institution-membership-grant-application', {
      institution: institution,
      user: user,
      status: 'awaiting_verification',
    });

    await institutionPage.visit({ institution_slug: 'nus' });
    assert.strictEqual(currentURL(), '/campus/nus');

    await institutionPage.claimOfferButtons[0].hover();
    assertTooltipContent(assert, { contentString: 'As a CodeCrafters member, you already have full access.' });
  });

  // TODO: Test unauthenticated user flows:
  //   - Hovering on the claim offer button should reveal a tooltip with the text "Click to login via GitHub"
  //   - Clicking on the claim offer button should redirect the user to the login page
  //
  // TODO: Test member/VIP flow:
  //   - Hovering on the claim offer button should reveal a tooltip with the text "As a CodeCrafters member, you already have full access."
  //   - Clicking on the claim offer button should do nothing
  //
  // TODO: Test flow for user with expired grant
  // TODO: Test that visiting an invalid institution slug redirects to 404
});
