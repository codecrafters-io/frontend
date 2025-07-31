import institutionPage from 'codecrafters-frontend/tests/pages/institution-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | institution-page | claim-offer-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('can view institution page as unauthenticated user', async function (assert) {
    testScenario(this.server);
    createNUSInstitution(this.server);

    await institutionPage.visit({ institution_slug: 'nus' });
    assert.strictEqual(currentURL(), '/institutions/nus');

    await percySnapshot('Institution Page - Unauthenticated');
  });

  test('can claim offer', async function (assert) {
    testScenario(this.server);
    createNUSInstitution(this.server);
    signIn(this.owner, this.server);

    await institutionPage.visit({ institution_slug: 'nus' });
    assert.strictEqual(currentURL(), '/institutions/nus');

    await percySnapshot('Institution Page');

    const applicationModal = institutionPage.campusProgramApplicationModal;

    assert.notOk(applicationModal.isVisible);

    await institutionPage.claimOfferButtons[0].click();
    assert.ok(applicationModal.isVisible);

    assert.ok(applicationModal.verifyEmailButtonIsDisabled, 'Verify email button should be disabled if email is empty');

    assert.strictEqual(applicationModal.emailAddressInputPlaceholder, 'bill@u.nus.edu');
    await applicationModal.fillInEmailAddress('bill@nus.edu.sg');

    assert.notOk(applicationModal.verifyEmailButtonIsDisabled, 'Verify email button should be enabled if email is present');
    await applicationModal.clickOnVerifyEmailButton();

    // await this.pauseTest();
    // TODO: Test rest of claim offer flow
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

function createNUSInstitution(server) {
  return server.create('institution', {
    slug: 'nus',
    shortName: 'NUS',
    logoUrl: 'https://codecrafters.io/images/app_institution_logos/nus.svg',
    officialEmailAddressSuffixes: ['@u.nus.edu', '@nus.edu.sg'],
  });
}
