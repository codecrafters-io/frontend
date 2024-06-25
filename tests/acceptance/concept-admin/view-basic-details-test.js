import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import basicDetailsPage from 'codecrafters-frontend/tests/pages/concept-admin/basic-details-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | concept-admin | view-basic-details', function (hooks) {
  setupApplicationTest(hooks);

  test('can view basic details', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('concept', { slug: 'dummy' });

    await basicDetailsPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await percySnapshot('Concept Admin - Basic Details');
  });

  test('draft label is present in concept admin page for draft concepts', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('concept', {
      slug: 'new-concept',
      title: 'New Concept',
      'description-markdown': 'This is a new concept.',
      blocks: [
        {
          type: 'markdown',
          args: {
            markdown: `This is the first markdown block.`,
          },
        },
      ],
      status: 'draft',
    });

    await basicDetailsPage.visit({ concept_slug: 'new-concept' });

    assert.ok(basicDetailsPage.header.draftLabel.isVisible, 'Expect draft label to be visible');
  });
});
