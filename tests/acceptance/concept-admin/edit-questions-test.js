import questionPage from 'codecrafters-frontend/tests/pages/concept-admin/question-page';
import questionsPage from 'codecrafters-frontend/tests/pages/concept-admin/questions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | concept-admin | edit-questions', function (hooks) {
  setupApplicationTest(hooks);

  test('can add question', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const concept = this.server.create('concept', { slug: 'dummy', blocks: [] });

    await questionsPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(questionsPage.questionCards.length, 0, 'There are no questions');

    await questionsPage.clickOnAddQuestionButton();
    await waitUntil(() => questionsPage.questionCards.length === 1);

    assert.strictEqual(this.server.schema.conceptQuestions.all().length, 1, 'There is one question');
    assert.strictEqual(this.server.schema.conceptQuestions.first().conceptId, concept.id, 'Question is linked to concept');
  });

  test('can edit query & slug', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const question = this.server.create('concept-question', {
      concept: this.server.create('concept', { slug: 'dummy' }),
      queryMarkdown: 'What is question?',
      slug: 'question-slug',
      options: [
        { markdown: '42', is_correct: true, explanation_markdown: 'Explanation 1' },
        { markdown: '24', isS_correct: false, explanation_markdown: 'Explanation 2' },
      ],
    });

    await questionsPage.visit({ concept_slug: 'dummy' });
    await questionsPage.clickOnQuestionCard('question-slug');

    assert.strictEqual(currentURL(), `/concepts/dummy/admin/questions/question-slug`, 'URL is correct');

    await questionPage.fillInQueryMarkdown('What is the answer?');
    await questionPage.fillInSlug('updated-question-slug');
    await questionPage.clickOnPublishChangesButton();

    assert.strictEqual(question.slug, 'updated-question-slug');
    assert.strictEqual(question.queryMarkdown, 'What is the answer?');

    assert.strictEqual(currentURL(), `/concepts/dummy/admin/questions/updated-question-slug`, 'URL is correct');
  });

  test('can add/edit/remove options', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const question = this.server.create('concept-question', {
      concept: this.server.create('concept', { slug: 'dummy', blocks: [] }),
      queryMarkdown: 'What is question?',
      slug: 'question-slug',
      options: [
        { markdown: '42', is_correct: true, explanation_markdown: 'Explanation 1' },
        { markdown: '24', isS_correct: false, explanation_markdown: 'Explanation 2' },
      ],
    });

    await questionsPage.visit({ concept_slug: 'dummy' });
    await questionsPage.clickOnQuestionCard('question-slug');

    // Edit option
    await questionPage.optionForms[0].fillInMarkdown('new42');
    await questionPage.clickOnPublishChangesButton();

    assert.strictEqual(question.options[0].markdown, 'new42');

    // Delete option
    await questionPage.optionForms[0].clickOnDeleteButton();
    await questionPage.clickOnPublishChangesButton();

    assert.strictEqual(question.options[0].markdown, '24');

    assert.strictEqual(question.options.length, 1);

    // Add option
    await questionPage.clickOnAddOptionButton();
    await questionPage.clickOnPublishChangesButton();

    assert.strictEqual(question.options.length, 2);
  });
});
