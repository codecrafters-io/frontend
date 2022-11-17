import tracksPage from 'codecrafters-frontend/tests/pages/tracks-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | submit-site-feedback', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can submit site feedback', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const feedbackDropdown = tracksPage.header.feedbackDropdown;

    await tracksPage.visit();

    await feedbackDropdown.toggle();
    assert.ok(feedbackDropdown.isOpen, 'Feedback dropdown is open');

    await percySnapshot('Feedback widget - before submission');

    await feedbackDropdown.toggle();
    assert.notOk(feedbackDropdown.isOpen, 'Feedback dropdown is closed');

    await feedbackDropdown.toggle();
    assert.ok(feedbackDropdown.isOpen, 'Feedback dropdown is open');

    await feedbackDropdown.clickOnSendButton();
    assert.ok(feedbackDropdown.sendButtonIsVisible, 'Send button is still visible');

    await feedbackDropdown.fillInExplanation('This is a test');

    await feedbackDropdown.clickOnSendButton();
    assert.notOk(feedbackDropdown.sendButtonIsVisible, 'Send button is not visible');
    assert.ok(feedbackDropdown.isOpen, 'Feedback dropdown is still open (has completed message)');

    await percySnapshot('Feedback widget - after submission');
  });
});
