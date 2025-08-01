import institutionPage from 'codecrafters-frontend/tests/pages/institution-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createInstitution from 'codecrafters-frontend/mirage/utils/create-institution';

module('Acceptance | institution-page | claim-offer-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('can claim offer', async function (assert) {
    testScenario(this.server);
    createInstitution(this.server, 'nus');

    signIn(this.owner, this.server);

    await institutionPage.visit({ institution_slug: 'nus' });
    assert.strictEqual(currentURL(), '/institutions/nus');

    await percySnapshot('Institution Page');

    const applicationModal = institutionPage.campusProgramApplicationModal;
    assert.notOk(applicationModal.isVisible);

    await institutionPage.claimOfferButtons[0].click();
    assert.ok(applicationModal.isVisible);
    assert.ok(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should be visible');

    assert.ok(applicationModal.enterEmailStepContainer.verifyEmailButtonIsDisabled, 'Verify email button should be disabled if email is empty');
    assert.strictEqual(applicationModal.enterEmailStepContainer.emailAddressInputPlaceholder, 'bill@u.nus.edu');

    await applicationModal.enterEmailStepContainer.fillInEmailAddress('bill@nus.edu.sg');

    assert.notOk(applicationModal.enterEmailStepContainer.verifyEmailButtonIsDisabled, 'Verify email button should be enabled if email is present');
    await applicationModal.enterEmailStepContainer.clickOnVerifyEmailButton();
    await animationsSettled(); // Ensure old step is animated out

    assert.notOk(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should not be visible');
    assert.ok(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should be visible');

    // await this.pauseTest();
    // TODO: Test rest of claim offer flow
  });
});
