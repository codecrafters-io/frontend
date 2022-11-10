import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsTeamAdmin, signInAsTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | team-page | manage-team-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('team admin sees manage team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();

    assert.ok(coursesPage.accountDropdown.hasLink('Manage Team'), 'Manage team link is present');
  });

  test('non-admin team member does not see manage team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();

    assert.notOk(coursesPage.accountDropdown.hasLink('Manage Team'), 'Manage team link is not present');
    assert.ok(coursesPage.accountDropdown.hasLink('View Team'), 'View team link is present');
  });
});
