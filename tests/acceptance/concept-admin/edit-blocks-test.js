import { drag } from 'ember-sortable/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { currentURL, settled } from '@ember/test-helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import blocksPage from 'codecrafters-frontend/tests/pages/concept-admin/blocks-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | concept-admin | edit-blocks', function (hooks) {
  setupApplicationTest(hooks);

  test('can add/edit/delete markdown blocks', async function (assert) {
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

    assert.strictEqual(blocksPage.editableBlocks.length, 3, 'expected 3 editable blocks to be present');
    await blocksPage.editableBlocks[1].click();
    await blocksPage.editableBlocks[1].markdownBlockEditor.fillInMarkdown('Edited markdown.');
    await blocksPage.editableBlocks[1].clickOnSaveButton();

    await blocksPage.clickOnPublishChangesButton();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.strictEqual(blocksPage.editableBlocks.length, 3, 'expected 3 editable blocks to be present');

    await blocksPage.insertBlockMarkers[0].click();
    await blocksPage.insertBlockMarkers[0].dropdown.clickOnItem('Markdown Block');

    await blocksPage.clickOnPublishChangesButton();
    assert.strictEqual(blocksPage.editableBlocks.length, 4, 'expected 4 editable blocks to be present');
  });

  test('can reorder markdown blocks', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('concept', {
      slug: 'dummy',
      blocks: [
        { type: 'markdown', args: { markdown: `block 1` } },
        { type: 'markdown', args: { markdown: `block 2` } },
        { type: 'markdown', args: { markdown: `block 3` } },
        { type: 'markdown', args: { markdown: `block 4` } },
        { type: 'markdown', args: { markdown: `block 5` } },
        { type: 'markdown', args: { markdown: `block 6` } },
      ],
    });

    await blocksPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await percySnapshot('Concept Admin - Blocks');

    assert.strictEqual(blocksPage.editableBlocks.length, 6, 'expected 6 editable blocks to be present');

    assert.strictEqual(blocksPage.editableBlocks[0].preview.text, 'block 1');
    assert.strictEqual(blocksPage.editableBlocks[1].preview.text, 'block 2');
    assert.strictEqual(blocksPage.editableBlocks[2].preview.text, 'block 3');
    assert.strictEqual(blocksPage.editableBlocks[3].preview.text, 'block 4');
    assert.strictEqual(blocksPage.editableBlocks[4].preview.text, 'block 5');

    const secondBlockHeight = document.querySelector('[data-test-sortable-item-id="block-1"]').getBoundingClientRect().height;
    const thirdBlockHeight = document.querySelector('[data-test-sortable-item-id="block-2"]').getBoundingClientRect().height;

    await drag('mouse', '[data-test-sortable-item-id="block-0"] [data-test-sortable-item-drag-handle]', () => {
      return { dy: secondBlockHeight + thirdBlockHeight + 1, dx: 0 };
    });

    assert.strictEqual(blocksPage.editableBlocks.length, 7, 'expected 6 editable blocks to be present');

    assert.strictEqual(blocksPage.editableBlocks[0].preview.text, 'Deleted Block (click to restore)');
    assert.strictEqual(blocksPage.editableBlocks[1].preview.text, 'block 2');
    assert.strictEqual(blocksPage.editableBlocks[2].preview.text, 'block 3');
    assert.strictEqual(blocksPage.editableBlocks[3].preview.text, 'block 1');
    assert.strictEqual(blocksPage.editableBlocks[4].preview.text, 'block 4');
  });

  test('dragging block to same position does not cause changes', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('concept', {
      slug: 'dummy',
      blocks: [
        { type: 'markdown', args: { markdown: `block 1` } },
        { type: 'markdown', args: { markdown: `block 2` } },
      ],
    });

    await blocksPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await percySnapshot('Concept Admin - Blocks');

    assert.strictEqual(blocksPage.editableBlocks.length, 2, 'expected 2 editable blocks to be present');

    assert.strictEqual(blocksPage.editableBlocks[0].preview.text, 'block 1');
    assert.strictEqual(blocksPage.editableBlocks[1].preview.text, 'block 2');

    await drag('mouse', '[data-test-sortable-item-id="block-0"] [data-test-sortable-item-drag-handle]', () => {
      return { dy: 1, dx: 0 };
    });

    assert.strictEqual(blocksPage.editableBlocks.length, 2, 'expected 2 editable blocks to be present');

    assert.strictEqual(blocksPage.editableBlocks[0].preview.text, 'block 1');
    assert.strictEqual(blocksPage.editableBlocks[1].preview.text, 'block 2');
  });

  test('can add/edit question blocks', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const concept = this.server.create('concept', {
      slug: 'dummy',
      blocks: [
        {
          type: 'markdown',
          args: {
            markdown: `This is a markdown block.`,
          },
        },
      ],
    });

    const numberOfQuestions = 2;

    for (let i = 1; i <= numberOfQuestions; i++) {
      this.server.create('concept-question', {
        concept: concept,
        slug: `dummy-question-${i}`,
        queryMarkdown: `Question${i}`,
        options: [],
      });
    }

    await blocksPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await blocksPage.insertBlockMarkers[1].click();
    await blocksPage.insertBlockMarkers[1].dropdown.clickOnItem('Question Block');

    await blocksPage.editableBlocks[1].click();
    await blocksPage.editableBlocks[1].conceptQuestionBlockEditor.selectQuestion('dummy-question-1');
    await blocksPage.editableBlocks[1].clickOnSaveButton();

    await blocksPage.clickOnPublishChangesButton();
    await settled();
    assert.strictEqual(blocksPage.editableBlocks.length, 3, 'expected 3 editable blocks to be present');

    await blocksPage.insertBlockMarkers[2].click();
    await blocksPage.insertBlockMarkers[2].dropdown.clickOnItem('Question Block');
    await blocksPage.editableBlocks[2].click();
    assert.ok(blocksPage.editableBlocks[2].conceptQuestionBlockEditor.dropdownOptions[0].isDisabled); // Select a question
    assert.strictEqual(blocksPage.editableBlocks[2].conceptQuestionBlockEditor.dropdownOptions[0].text, 'Select a question...');
    assert.ok(blocksPage.editableBlocks[2].conceptQuestionBlockEditor.dropdownOptions[2].isDisabled); // Previously used question
    assert.strictEqual(blocksPage.editableBlocks[2].conceptQuestionBlockEditor.dropdownOptions[2].text, 'Question1');

    await blocksPage.editableBlocks[2].conceptQuestionBlockEditor.selectQuestion('dummy-question-2');
    await blocksPage.editableBlocks[2].clickOnSaveButton();

    await blocksPage.clickOnPublishChangesButton();
    assert.strictEqual(blocksPage.editableBlocks.length, 4, 'expected 4 editable blocks to be present'); // Continue block is added at the end after publishing.
  });

  test('question blocks are sorted', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const concept = this.server.create('concept', {
      slug: 'dummy',
      blocks: [
        {
          type: 'markdown',
          args: {
            markdown: `This is a markdown block.`,
          },
        },
      ],
    });

    const numberOfQuestions = 4;

    for (let i = 1; i <= numberOfQuestions; i++) {
      this.server.create('concept-question', {
        concept: concept,
        slug: `dummy-question-${i}`,
        queryMarkdown: `Question${i}`,
        options: [],
      });
    }

    await blocksPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await blocksPage.insertBlockMarkers[1].click();
    await blocksPage.insertBlockMarkers[1].dropdown.clickOnItem('Question Block');

    await blocksPage.editableBlocks[1].click();

    // No questions disabled, all sorted in order.
    for (let i = 1; i <= numberOfQuestions; i++) {
      assert.strictEqual(blocksPage.editableBlocks[1].conceptQuestionBlockEditor.dropdownOptions[i].text, `Question${i}`);
    }

    await blocksPage.editableBlocks[1].conceptQuestionBlockEditor.selectQuestion('dummy-question-1');
    await blocksPage.editableBlocks[1].clickOnSaveButton();

    await blocksPage.clickOnPublishChangesButton();
    await settled();

    await blocksPage.insertBlockMarkers[2].click();
    await blocksPage.insertBlockMarkers[2].dropdown.clickOnItem('Question Block');

    await blocksPage.editableBlocks[2].click();
    await blocksPage.editableBlocks[2].conceptQuestionBlockEditor.selectQuestion('dummy-question-2');
    await blocksPage.editableBlocks[2].clickOnSaveButton();

    await blocksPage.clickOnPublishChangesButton();
    await settled();

    await blocksPage.insertBlockMarkers[3].click();
    await blocksPage.insertBlockMarkers[3].dropdown.clickOnItem('Question Block');

    await blocksPage.editableBlocks[3].click();

    const numberOfUsedQuestions = 2;

    // Question1 & Question2 selected, they will come at the bottom sorted.
    // At the top we should get Question3 & Question4.
    for (let i = 1; i <= numberOfUsedQuestions; i++) {
      assert.strictEqual(blocksPage.editableBlocks[3].conceptQuestionBlockEditor.dropdownOptions[i].text, `Question${i + 2}`);
    }

    for (let i = numberOfUsedQuestions + 1; i <= 4; i++) {
      assert.strictEqual(blocksPage.editableBlocks[3].conceptQuestionBlockEditor.dropdownOptions[i].text, `Question${i - 2}`);
    }
  });

  test('Add new question button works', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const concept = this.server.create('concept', {
      slug: 'dummy',
      blocks: [
        {
          type: 'markdown',
          args: {
            markdown: `This is a markdown block.`,
          },
        },
      ],
    });

    this.server.create('concept-question', {
      concept: concept,
      slug: `dummy-question-1`,
      queryMarkdown: `Question1`,
      options: [],
    });

    await blocksPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await blocksPage.insertBlockMarkers[1].click();
    await blocksPage.insertBlockMarkers[1].dropdown.clickOnItem('Question Block');

    await blocksPage.editableBlocks[1].click();

    window.confirm = () => true;

    await blocksPage.editableBlocks[1].conceptQuestionBlockEditor.clickOnNewQuestionButton();
    assert.strictEqual(currentURL(), '/concepts/dummy/admin/questions');
  });

  test('click to continue block is automatically added when changes are published', async function (assert) {
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

    await blocksPage.insertBlockMarkers[1].click();
    await blocksPage.insertBlockMarkers[1].dropdown.clickOnItem('Markdown Block');

    await blocksPage.clickOnPublishChangesButton();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.strictEqual(blocksPage.editableBlocks.length, 4, 'expected 4 editable blocks to be present');
    assert.ok(blocksPage.editableBlocks[3].text.includes('Continue'), 'expected the last block to be a click to continue block');
  });

  test('click to continue block is not added if last block is already a click to continue block', async function (assert) {
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

    await blocksPage.insertBlockMarkers[1].click();
    await blocksPage.insertBlockMarkers[1].dropdown.clickOnItem('Markdown Block');

    await blocksPage.insertBlockMarkers[3].click();
    await blocksPage.insertBlockMarkers[3].dropdown.clickOnItem('Click to Continue Block');

    await blocksPage.clickOnPublishChangesButton();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.strictEqual(blocksPage.editableBlocks.length, 4, 'expected 4 editable blocks to be present');
    assert.ok(blocksPage.editableBlocks[3].text.includes('Continue'), 'expected the last block to be a click to continue block');
  });
});
