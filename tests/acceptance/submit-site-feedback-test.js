import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | submit-site-feedback', function (hooks) {
  setupApplicationTest(hooks);

  test('can submit site feedback if user is authenticated', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await submitFeedback(assert, this.server, 'authenticated feedback');
  });

  test('can submit site feedback if user is not authenticated', async function (assert) {
    testScenario(this.server);

    await submitFeedback(assert, this.server, 'anonymous feedback');
  });

  async function submitFeedback(assert, server, feedbackMessage) {
    const feedbackDropdown = catalogPage.header.feedbackDropdown;

    await catalogPage.visit();

    await feedbackDropdown.toggle();
    assert.ok(feedbackDropdown.isVisible, 'Feedback dropdown is open');

    await percySnapshot('Feedback widget - before submission');

    await feedbackDropdown.toggle();
    assert.notOk(feedbackDropdown.isVisible, 'Feedback dropdown is closed');

    await feedbackDropdown.toggle();
    assert.ok(feedbackDropdown.isVisible, 'Feedback dropdown is open');

    await feedbackDropdown.clickOnSendButton();
    assert.ok(feedbackDropdown.sendButtonIsVisible, 'Send button is still visible');

    await feedbackDropdown.fillInExplanation(feedbackMessage);

    await feedbackDropdown.clickOnSendButton();
    assert.notOk(feedbackDropdown.sendButtonIsVisible, 'Send button is not visible');
    assert.ok(feedbackDropdown.isVisible, 'Feedback dropdown is still open (has completed message)');

    const feedbackSubmission = server.schema.siteFeedbackSubmissions.first();
    assert.strictEqual(feedbackSubmission.source, 'header');
    assert.strictEqual(JSON.stringify(feedbackSubmission.sourceMetadata), '{}');
    assert.strictEqual(feedbackSubmission.explanation, feedbackMessage);

    await percySnapshot('Feedback widget - after submission');
  }
});
