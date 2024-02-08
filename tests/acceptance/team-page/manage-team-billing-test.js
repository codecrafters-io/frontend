import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import teamPage from 'codecrafters-frontend/tests/pages/team-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | team-page | manage-team-billing-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('team with active pilot sees pilot details', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    const team = this.server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });
    this.server.schema.teamPilots.create({ team: team, endDate: new Date(2099, 0, 1) });

    this.server.create('team-membership', {
      createdAt: new Date(),
      id: 'dummy-team-membership-id',
      user: user,
      team: team,
      isAdmin: true,
    });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.ok(teamPage.setupSubscriptionContainer.isPresent, 'pilot details are visible');
    assert.strictEqual(teamPage.setupSubscriptionContainer.pilotDetailsText, "Your team's pilot is valid until January 1st, 2099 at 12:00 AM.");
  });

  test('team with expired pilot sees payment method prompt', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    const team = this.server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });
    this.server.schema.teamPilots.create({ team: team, endDate: new Date(1999, 0, 1) });

    this.server.create('team-membership', {
      createdAt: new Date(),
      id: 'dummy-team-membership-id',
      user: user,
      team: team,
      isAdmin: true,
    });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.ok(teamPage.setupSubscriptionContainer.isPresent, 'pilot details are visible');
    assert.strictEqual(teamPage.setupSubscriptionContainer.pilotDetailsText, "Your team's pilot ended on January 1st, 1999.");
    assert.strictEqual(teamPage.setupSubscriptionContainer.instructionsText, 'To setup your team subscription, start by adding a payment method:');

    await teamPage.setupSubscriptionContainer.clickOnAddPaymentMethodButton();
    assert.strictEqual(window.location.href, 'https://test.com/team_payment_method_update_request', 'should redirect to team billing session URL');
  });

  test('team with expired pilot and valid payment method can start subscription', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    const team = this.server.create('team', { id: 'dummy-team-id', name: 'Dummy Team', pricingPlanType: 'yearly' });
    this.server.schema.teamPilots.create({ team: team, endDate: new Date(1999, 0, 1) });

    this.server.create('team-membership', {
      createdAt: new Date(),
      id: 'dummy-team-membership-id',
      user: user,
      team: team,
      isAdmin: true,
    });

    this.server.create('team-payment-method', { team: team, creator: user });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.ok(teamPage.setupSubscriptionContainer.isPresent, 'pilot details are visible');
    assert.strictEqual(teamPage.setupSubscriptionContainer.pilotDetailsText, "Your team's pilot ended on January 1st, 1999.");
    assert.strictEqual(teamPage.setupSubscriptionContainer.instructionsText, 'Click below to start your subscription:');

    assert.strictEqual(
      teamPage.setupSubscriptionContainer.firstInvoiceDetailsText,
      "Your team's payment method will be charged $790/seat/yr for 10 seats. Contact us for questions.",
    );

    await teamPage.setupSubscriptionContainer.clickOnStartSubscriptionButton();
    assert.strictEqual(teamPage.subscriptionSettingsContainer.instructionsText, 'Contact us for invoices or to make changes to your subscription:');
  });

  test('team with committed seats sees payment prompt', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    const team = this.server.create('team', { id: 'dummy-team-id', name: 'Dummy Team', committedSeats: 5 });

    this.server.create('team-membership', {
      createdAt: new Date(),
      id: 'dummy-team-membership-id',
      user: user,
      team: team,
      isAdmin: true,
    });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.strictEqual(teamPage.setupSubscriptionContainer.instructionsText, 'To setup your team subscription, start by adding a payment method:');

    await teamPage.setupSubscriptionContainer.clickOnAddPaymentMethodButton();
    assert.strictEqual(window.location.href, 'https://test.com/team_payment_method_update_request', 'should redirect to team billing session URL');
  });
});
