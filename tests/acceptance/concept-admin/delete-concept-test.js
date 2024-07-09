import basicDetailsPage from 'codecrafters-frontend/tests/pages/concept-admin/basic-details-page';
import { module, test } from 'qunit';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { signInAsConceptAuthor, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { currentURL, waitUntil, settled } from '@ember/test-helpers';
import { assertTooltipContent, assertTooltipNotRendered } from 'ember-tooltips/test-support';
import percySnapshot from '@percy/ember';
import conceptsPage from 'codecrafters-frontend/tests/pages/concepts-page';

module('Acceptance | concept-admin | delete-concept-test', function (hooks) {
  setupApplicationTest(hooks);

  test('staff can delete any concept', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('concept', {
      slug: 'dummy',
      blocks: [
        {
          type: 'markdown',
          args: {
            markdown: `This is the first markdown block.`,
          },
        },
      ],
    });

    await basicDetailsPage.visit({ concept_slug: 'dummy' });
    await basicDetailsPage.deleteMyConceptButton.click();
    assert.true(basicDetailsPage.deleteConceptModal.isVisible, 'delete concept modal is open');

    await basicDetailsPage.deleteMyConceptButton.hover();
    assertTooltipNotRendered(assert, 'tooltip is not rendered on hover');

    await percySnapshot('Concept Admin - Delete Concept Modal');

    await basicDetailsPage.deleteConceptModal.deleteConceptButton.hover();
    assert.ok(basicDetailsPage.deleteConceptModal.deleteConceptButton.progressIndicator.isVisible, 'progress indicator should be visible');

    await basicDetailsPage.deleteConceptModal.deleteConceptButton.leave();
    assert.notOk(basicDetailsPage.deleteConceptModal.deleteConceptButton.progressIndicator.isVisible, 'progress indicator should not be visible');

    await basicDetailsPage.deleteConceptModal.deleteConceptButton.press();
    await waitUntil(() => currentURL() === '/concepts');
    await settled(); // Delete request triggers after redirect
    assert.strictEqual(conceptsPage.conceptCards.length, 0, 'Concept is deleted');
  });

  test('concept authors can delete their own concepts', async function (assert) {
    testScenario(this.server);
    signInAsConceptAuthor(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    this.server.create('concept', {
      slug: 'dummy',
      author: currentUser,
      blocks: [
        {
          type: 'markdown',
          args: {
            markdown: `This is the first markdown block.`,
          },
        },
      ],
    });

    await basicDetailsPage.visit({ concept_slug: 'dummy' });
    await basicDetailsPage.deleteMyConceptButton.click();
    assert.true(basicDetailsPage.deleteConceptModal.isVisible, 'delete concept modal is open');

    await basicDetailsPage.deleteMyConceptButton.hover();
    assertTooltipNotRendered(assert, 'tooltip is not rendered');

    await percySnapshot('Concept Admin - Delete Concept Modal');

    await basicDetailsPage.deleteConceptModal.deleteConceptButton.hover();
    assert.ok(basicDetailsPage.deleteConceptModal.deleteConceptButton.progressIndicator.isVisible, 'progress indicator should be visible');

    await basicDetailsPage.deleteConceptModal.deleteConceptButton.leave();
    assert.notOk(basicDetailsPage.deleteConceptModal.deleteConceptButton.progressIndicator.isVisible, 'progress indicator should not be visible');

    await basicDetailsPage.deleteConceptModal.deleteConceptButton.press();
    await waitUntil(() => currentURL() === '/concepts');
    await settled(); // Delete request triggers after redirect
    assert.strictEqual(conceptsPage.conceptCards.length, 0, 'Concept is deleted');
  });

  test('concept authors cannot delete others concepts', async function (assert) {
    testScenario(this.server);
    signInAsConceptAuthor(this.owner, this.server);

    this.server.create('concept', {
      slug: 'dummy',
      author: this.server.create('user', { username: 'other-user' }),
      blocks: [
        {
          type: 'markdown',
          args: {
            markdown: `This is the first markdown block.`,
          },
        },
      ],
    });

    await basicDetailsPage.visit({ concept_slug: 'dummy' });
    await basicDetailsPage.deleteMyConceptButton.click();
    assert.false(basicDetailsPage.deleteConceptModal.isVisible, 'delete concept modal is not open');

    await basicDetailsPage.deleteMyConceptButton.hover();
    assertTooltipContent(assert, {
      contentString: `This concept was created by ${this.server.schema.concepts.first().author.username}, only they have permissions to delete it.`,
    });
  });
});
