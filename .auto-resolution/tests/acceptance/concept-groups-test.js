import conceptGroupsPage from 'codecrafters-frontend/tests/pages/concept-groups-page';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import percySnapshot from '@percy/ember';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { currentURL } from '@ember/test-helpers';

function createConcepts(server) {
  createConceptFromFixture(server, tcpOverview);
  createConceptFromFixture(server, networkProtocols);
}

module('Acceptance | concept-groups-test', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
    createConcepts(this.server);

    const tcpOverviewConcept = this.server.schema.concepts.findBy({ slug: 'tcp-overview' });
    const networkProtocolsConcept = this.server.schema.concepts.findBy({ slug: 'network-protocols' });

    const user = this.server.schema.users.first();
    this.conceptGroup = this.server.create('concept-group', {
      author: user,
      description_markdown: 'Dummy description',
      concepts: [tcpOverviewConcept, networkProtocolsConcept],
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'test-concept-group',
      title: 'Test Concept Group',
    });
  });

  test('displays concept-group page when visiting a valid concept-group', async function (assert) {
    await conceptGroupsPage.visit({ concept_group_slug: this.conceptGroup.slug });

    assert.strictEqual(currentURL(), '/collections/test-concept-group');
  });

  test('redirects to / when visiting a non-existing concept-group', async function (assert) {
    await conceptGroupsPage.visit({ concept_group_slug: 'nonexistent-concept-group' });

    assert.strictEqual(currentURL(), '/catalog');
  });

  test('displays the correct concept group details for the header', async function (assert) {
    await conceptGroupsPage.visit({ concept_group_slug: this.conceptGroup.slug });
    await percySnapshot('Concept Group');

    assert.strictEqual(conceptGroupsPage.header.title, 'Test Concept Group');
    assert.strictEqual(conceptGroupsPage.header.description, 'Dummy description');
    assert.strictEqual(conceptGroupsPage.header.author.username, 'rohitpaulk');
    assert.strictEqual(conceptGroupsPage.header.author.title, 'Collection Author');
  });

  test('displays the correct concept cards', async function (assert) {
    await conceptGroupsPage.visit({ concept_group_slug: this.conceptGroup.slug });

    assert.strictEqual(conceptGroupsPage.conceptCards.length, 2);
    assert.strictEqual(conceptGroupsPage.conceptCards[0].title, 'TCP: An Overview');
    assert.strictEqual(conceptGroupsPage.conceptCards[1].title, 'Network Protocols');
  });

  test('displays no progress bar if progress percentage is 0', async function (assert) {
    await conceptGroupsPage.visit({ concept_group_slug: this.conceptGroup.slug });

    await conceptGroupsPage.clickOnConceptCard('TCP: An Overview');

    await conceptGroupsPage.visit({ concept_group_slug: this.conceptGroup.slug });

    assert.false(conceptGroupsPage.conceptCards[0].hasProgressBar, 'Progress bar should not be visible after returning from concept');
    assert.strictEqual(conceptGroupsPage.conceptCards[0].readingTime, '8 mins', 'Reading time should be visible after returning from concept');
  });
});
