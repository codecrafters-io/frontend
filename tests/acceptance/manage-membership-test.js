import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsSubscriber, signInAsTrialingSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import membershipPage from 'codecrafters-frontend/tests/pages/membership-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | manage-membership-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('subscriber can manage membership', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await membershipPage.visit();
    assert.equal(1, 1);
  });

  test('subscriber can cancel trial', async function (assert) {
    testScenario(this.server);
    signInAsTrialingSubscriber(this.owner, this.server);

    window.confirm = () => true;

    await membershipPage.visit();
    assert.equal(membershipPage.membershipPlanSection.descriptionText, 'Your trial for the Monthly plan is currently active.');

    await membershipPage.clickOnCancelTrialButton();
    assert.equal(membershipPage.membershipPlanSection.descriptionText, 'Your CodeCrafters membership is currently inactive.');
  });
});
