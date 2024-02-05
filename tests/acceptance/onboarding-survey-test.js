import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import welcomePage from 'codecrafters-frontend/tests/pages/welcome-page';
import windowMock from 'ember-window-mock';
import { animationsSettled } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { visit } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | onboarding-survey-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('can answer questions in onboarding survey', async function (assert) {
    const user = await signIn(this.owner, this.server);

    const onboardingSurvey = this.server.create('onboarding-survey', {
      id: 'dummy-survey-id',
      user: user,
      status: 'incomplete',
    });

    assert.strictEqual(onboardingSurvey.selectedOptionsForUsagePurpose.length, 0, 'No usage purpose options should be selected initially');
    assert.strictEqual(onboardingSurvey.selectedOptionsForReferralSource.length, 0, 'No referral source options should be selected initially');

    await welcomePage.visit();
    assert.strictEqual(currentURL(), '/welcome', 'current URL should be /welcome');

    await welcomePage.onboardingSurveyWizard.clickOnSelectableItem('Master a language');
    await welcomePage.onboardingSurveyWizard.clickOnSelectableItem('Interview prep');
    await welcomePage.onboardingSurveyWizard.clickOnContinueButton();
    await animationsSettled();

    assert.strictEqual(onboardingSurvey.selectedOptionsForUsagePurpose.length, 2, 'Two usage purpose options should be selected');
    assert.strictEqual(onboardingSurvey.selectedOptionsForUsagePurpose[0], 'Master a language', 'First usage purpose option should be selected');
    assert.strictEqual(onboardingSurvey.selectedOptionsForUsagePurpose[1], 'Interview prep', 'Second usage purpose option should be selected');

    await welcomePage.onboardingSurveyWizard.clickOnSelectableItem('YouTube');
    await welcomePage.onboardingSurveyWizard.clickOnContinueButton();
    await animationsSettled();

    assert.strictEqual(onboardingSurvey.selectedOptionsForReferralSource.length, 1, 'One referral source option should be selected');
    assert.strictEqual(onboardingSurvey.selectedOptionsForReferralSource[0], 'YouTube', 'Referral source option should be selected');
    assert.strictEqual(onboardingSurvey.status, 'complete', 'Survey should be marked as complete');
    assert.strictEqual(currentURL(), '/catalog');
  });

  test('redirects to catalog if no survey is found', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await welcomePage.visit();
    assert.strictEqual(currentURL(), '/catalog');
  });

  test('redirects to catalog if survey is already complete', async function (assert) {
    testScenario(this.server);
    const user = await signIn(this.owner, this.server);

    this.server.create('onboarding-survey', {
      id: 'dummy-survey-id',
      user: user,
      status: 'complete',
    });

    await welcomePage.visit();
    assert.strictEqual(currentURL(), '/catalog');
  });

  test('stores ?next query param and redirects to it after survey completion', async function (assert) {
    testScenario(this.server);
    const user = await signIn(this.owner, this.server);

    this.server.create('onboarding-survey', {
      id: 'dummy-survey-id',
      user: user,
      status: 'incomplete',
    });

    await welcomePage.visit({ next: 'https://localhost:1234/refer' });
    assert.strictEqual(currentURL(), '/welcome', 'current URL should be /welcome');

    await welcomePage.onboardingSurveyWizard.clickOnSelectableItem('Master a language');
    await welcomePage.onboardingSurveyWizard.clickOnContinueButton();
    await animationsSettled();

    await welcomePage.onboardingSurveyWizard.clickOnSelectableItem('YouTube');
    await welcomePage.onboardingSurveyWizard.clickOnContinueButton();
    await animationsSettled();
    testScenario(this.server);

    assert.strictEqual(windowMock.location.href, `https://localhost:1234/refer`, 'should redirect to login URL');
  });
});
