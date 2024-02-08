import conceptGroupsPage from 'codecrafters-frontend/tests/pages/concept-groups-page';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import percySnapshot from '@percy/ember';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { currentURL } from '@ember/test-helpers';

function createConcepts(server) {
  createConceptFromFixture(server, tcpOverview);
  createConceptFromFixture(server, networkProtocols);
}

module('Acceptance | concept-groups-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('displays concept-group page when visiting a valid concept-group', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();

    const conceptGroup = this.server.create('concept-group', {
      author: user,
      description_markdown: 'Dummy description',
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'test-concept-group',
      title: 'Test Concept Group',
    });

    await conceptGroupsPage.visit({ concept_group_slug: conceptGroup.slug });

    assert.strictEqual(currentURL(), '/collections/test-concept-group');
  });

  test('redirects to / when visiting a non-existing concept-group', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    await conceptGroupsPage.visit({ concept_group_slug: 'non-existent-concept-group' });

    assert.strictEqual(currentURL(), '/catalog');
  });

  test('displays the correct concept group details for the header', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();

    const conceptGroup = this.server.create('concept-group', {
      author: user,
      description_markdown: 'Dummy description',
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'test-concept-group',
      title: 'Test Concept Group',
    });

    await conceptGroupsPage.visit({ concept_group_slug: conceptGroup.slug });
    await percySnapshot('Concept Group');

    assert.strictEqual(conceptGroupsPage.header.title, 'Test Concept Group');
    assert.strictEqual(conceptGroupsPage.header.description, 'Dummy description');
    assert.strictEqual(conceptGroupsPage.header.author.username, 'rohitpaulk');
    assert.strictEqual(conceptGroupsPage.header.author.title, 'Collection Author');
  });

  test('displays the correct concept cards', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();

    const conceptGroup = this.server.create('concept-group', {
      author: user,
      description_markdown: 'Dummy description',
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'test-concept-group',
      title: 'Test Concept Group',
    });

    await conceptGroupsPage.visit({ concept_group_slug: conceptGroup.slug });

    assert.strictEqual(conceptGroupsPage.conceptCards.length, 2);
    assert.strictEqual(conceptGroupsPage.conceptCards[0].title, 'TCP: An Overview');
    assert.strictEqual(conceptGroupsPage.conceptCards[1].title, 'Network Protocols');
  });
});
