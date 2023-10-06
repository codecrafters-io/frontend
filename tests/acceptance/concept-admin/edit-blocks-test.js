import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import blocksPage from 'codecrafters-frontend/tests/pages/concept-admin/blocks-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | concept-admin | edit-blocks', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can edit markdown blocks', async function (assert) {
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
        {
          type: 'markdown',
          args: {
            markdown: `This is the second markdown block.`,
          },
        },
      ],
    });

    await blocksPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await percySnapshot('Concept Admin - Blocks');

    const firstMarkdownBlock = blocksPage.editableBlocks[0];
    const secondMarkdownBlock = blocksPage.editableBlocks[1];

    await firstMarkdownBlock.click();
    await firstMarkdownBlock.markdownBlockEditor.fillInMarkdown('This is the first markdown block, edited.');
    await firstMarkdownBlock.clickOnSaveButton();

    await secondMarkdownBlock.click();
    await secondMarkdownBlock.markdownBlockEditor.fillInMarkdown('This is the second markdown block, edited.');
    await secondMarkdownBlock.clickOnSaveButton();

    await firstMarkdownBlock.click();
    await firstMarkdownBlock.clickOnDeleteButton();

    await blocksPage.insertBlockMarkers[1].click();
    await blocksPage.insertBlockMarkers[1].dropdown.clickOnItem('Markdown Block');

    assert.strictEqual(blocksPage.editableBlocks.length, 2, 'expected 2 editable blocks to be present');
    await blocksPage.editableBlocks[0].click();
    await blocksPage.editableBlocks[0].markdownBlockEditor.fillInMarkdown('Edited markdown.');
    await blocksPage.editableBlocks[0].clickOnSaveButton();

    await blocksPage.clickOnPublishChangesButton();
    assert.strictEqual(blocksPage.editableBlocks.length, 2, 'expected 2 editable blocks to be present');

    await blocksPage.insertBlockMarkers[0].click();
    await blocksPage.insertBlockMarkers[0].dropdown.clickOnItem('Markdown Block');

    await blocksPage.clickOnPublishChangesButton();
    assert.strictEqual(blocksPage.editableBlocks.length, 3, 'expected 3 editable blocks to be present');
  });
});
