import basicDetailsPage from 'codecrafters-frontend/tests/pages/concept-admin/basic-details-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, triggerEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | concept-admin | edit-basic-details', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('editing the slug updates the url of other tab links', async function (assert) {
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
    await basicDetailsPage.form.inputFields[1].fillIn('new-slug');
    await basicDetailsPage.form.inputFields[1].blur();

    await basicDetailsPage.clickOnHeaderTabLink('Blocks');
    assert.strictEqual(currentURL(), '/concepts/new-slug/admin/blocks');
  });

  test('pasting a link automatically converts the link to markdown format', async function (assert) {
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
    await basicDetailsPage.form.inputFields[2].fillIn('this url should be changed');

    const basicDetailsPageTextarea = document.querySelectorAll('[data-test-basic-details-input-field]')[2];
    basicDetailsPageTextarea.setSelectionRange(5, 8);

    triggerEvent(basicDetailsPageTextarea, 'paste', {
      clipboardData: {
        getData: () => 'https://test.url.com',
      },
    });

    await basicDetailsPage.form.inputFields[2].blur();

    assert.strictEqual(basicDetailsPage.form.inputFields[2].value, 'this [url](https://test.url.com) should be changed');
  });
});
