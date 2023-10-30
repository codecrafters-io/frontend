import conceptPage from 'codecrafters-frontend/tests/pages/concept-page';
import conceptsPage from 'codecrafters-frontend/tests/pages/concepts-page';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import percySnapshot from '@percy/ember';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

function createConcepts(server) {
  createConceptFromFixture(server, tcpOverview);
  createConceptFromFixture(server, networkProtocols);
}

module('Acceptance | concepts-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can create concept', async function (assert) {
    testScenario(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();
    await conceptsPage.clickOnCreateConceptButton();

    assert.strictEqual(currentURL(), '/concepts/new-concept/admin/basic-details');
  });

  test('can view concepts', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();
    assert.strictEqual(1, 1);

    await percySnapshot('Concept - Start');

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].selectOption('PDF');
    await conceptPage.questionCards[0].clickOnSubmitButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[1].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[2].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[3].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    await percySnapshot('Concept - Completed');
  });

  test('can use keyboard to navigate through concept', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('TCP: An Overview');
    assert.strictEqual(conceptPage.blocks.length, 1);

    await conceptPage.pressSpace();
    assert.strictEqual(conceptPage.blocks.length, 2);

    await conceptPage.pressBackspace();
    assert.strictEqual(conceptPage.blocks.length, 1);

    await conceptPage.pressEnter();
    assert.strictEqual(conceptPage.blocks.length, 2);
  });

  test('tracks concepts events', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');

    assert.strictEqual(filteredAnalyticsEvents.length, 8, 'Expected 8 analytics events to be tracked');

    assert.deepEqual(
      filteredAnalyticsEvents.map((event) => event.name),
      [
        'viewed_page',
        'viewed_page',
        'viewed_concept',
        'progressed_through_concept',
        'progressed_through_concept',
        'progressed_through_concept',
        'progressed_through_concept',
        'progressed_through_concept',
      ],
    );
  });
});
