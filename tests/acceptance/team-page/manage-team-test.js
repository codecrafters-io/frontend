import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsTeamAdmin, signInAsTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | team-page | manage-team-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('team admin sees manage team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.ok(catalogPage.accountDropdown.hasLink('Manage Team'), 'Manage team link is present');
  });

  test('non-admin team member does not see manage team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.notOk(catalogPage.accountDropdown.hasLink('Manage Team'), 'Manage team link is not present');
    assert.ok(catalogPage.accountDropdown.hasLink('View Team'), 'View team link is present');
  });
});
