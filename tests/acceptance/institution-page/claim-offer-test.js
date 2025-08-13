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

  test('can send verification email', async function (assert) {
    testScenario(this.server);
    createInstitution(this.server, 'nus');

    signIn(this.owner, this.server);

    await institutionPage.visit({ institution_slug: 'nus' });
    assert.strictEqual(currentURL(), '/campus/nus');

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
  });

  test('can view verification step if application is awaiting verification', async function (assert) {
    testScenario(this.server);
    const institution = createInstitution(this.server, 'nus');
    const user = signIn(this.owner, this.server);

    this.server.create('institution-membership-grant-application', {
      institution: institution,
      user: user,
      status: 'awaiting_verification',
    });

    await institutionPage.visit({ institution_slug: 'nus' });
    await institutionPage.claimOfferButtons[0].click();

    const applicationModal = institutionPage.campusProgramApplicationModal;
    assert.ok(applicationModal.isVisible);
    assert.notOk(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should not be visible');
    assert.ok(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should be visible');
  });

  test('can redo the flow from change email button', async function (assert) {
    testScenario(this.server);
    const institution = createInstitution(this.server, 'nus');
    const user = signIn(this.owner, this.server);

    this.server.create('institution-membership-grant-application', {
      institution: institution,
      user: user,
      status: 'awaiting_verification',
      normalizedEmailAddress: 'bill@u.nus.edu',
      originalEmailAddress: 'bill@u.nus.edu',
    });

    await institutionPage.visit({ institution_slug: 'nus' });
    await institutionPage.claimOfferButtons[0].click();

    const applicationModal = institutionPage.campusProgramApplicationModal;
    assert.ok(applicationModal.isVisible);
    assert.notOk(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should not be visible');
    assert.ok(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should be visible');
    assert.strictEqual(applicationModal.verifyEmailStepContainer.emailAddress, 'bill@u.nus.edu');

    await percySnapshot('Institution Page - Verify Email Step with Change/Resend buttons');

    await applicationModal.verifyEmailStepContainer.clickOnChangeEmail();

    assert.ok(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should be visible');
    assert.notOk(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should not be visible');
    assert.strictEqual(applicationModal.enterEmailStepContainer.emailAddressInputValue, 'bill@u.nus.edu');
    await settled();

    await percySnapshot('Institution Page - Enter Email Step with prefilled email');

    await applicationModal.enterEmailStepContainer.fillInEmailAddress('bill-new@u.nus.edu');
    await applicationModal.enterEmailStepContainer.clickOnVerifyEmailButton();
    await animationsSettled();

    assert.notOk(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should not be visible');
    assert.ok(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should be visible');
    assert.strictEqual(applicationModal.verifyEmailStepContainer.emailAddress, 'bill-new@u.nus.edu');
  });

  test('can redo the flow from resend email button', async function (assert) {
    testScenario(this.server);
    const institution = createInstitution(this.server, 'nus');
    const user = signIn(this.owner, this.server);

    this.server.create('institution-membership-grant-application', {
      institution: institution,
      user: user,
      status: 'awaiting_verification',
      normalizedEmailAddress: 'bill@u.nus.edu',
      originalEmailAddress: 'bill@u.nus.edu',
    });

    await institutionPage.visit({ institution_slug: 'nus' });
    await institutionPage.claimOfferButtons[0].click();

    const applicationModal = institutionPage.campusProgramApplicationModal;
    assert.ok(applicationModal.isVisible);
    assert.notOk(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should not be visible');
    assert.ok(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should be visible');

    await applicationModal.verifyEmailStepContainer.clickOnResendEmail();

    assert.ok(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should be visible');
    assert.notOk(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should not be visible');
    assert.strictEqual(applicationModal.enterEmailStepContainer.emailAddressInputValue, 'bill@u.nus.edu');
    await settled();

    await percySnapshot('Institution Page - Enter Email Step with prefilled email (from resend)');

    await applicationModal.enterEmailStepContainer.clickOnVerifyEmailButton();
    await animationsSettled();

    assert.notOk(applicationModal.enterEmailStepContainer.isVisible, 'Enter email step should not be visible');
    assert.ok(applicationModal.verifyEmailStepContainer.isVisible, 'Verify email step should be visible');
    assert.strictEqual(applicationModal.verifyEmailStepContainer.emailAddress, 'bill@u.nus.edu');
  });

  // TODO: Test rejected application flow
});
