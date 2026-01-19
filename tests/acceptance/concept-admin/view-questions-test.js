import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import questionsPage from 'codecrafters-frontend/tests/pages/concept-admin/questions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | concept-admin | view-questions', function (hooks) {
  setupApplicationTest(hooks);

  test('can view basic details', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const concept = this.server.create('concept', { slug: 'dummy' });

    const question1 = this.server.create('concept-question', {
      concept: concept,
      queryMarkdown: 'What is question 1?',
      slug: 'question-1',
      options: [
        { markdown: '42', is_correct: true, explanation_markdown: 'Explanation 1' },
        { markdown: '24', isS_correct: false, explanation_markdown: 'Explanation 2' },
      ],
    });

    const question2 = this.server.create('concept-question', {
      concept: concept,
      queryMarkdown: 'What is question 2?',
      slug: 'question-2',
      options: [
        { markdown: '42', is_correct: true, explanation_markdown: 'Explanation 1' },
        { markdown: '24', isS_correct: false, explanation_markdown: 'Explanation 2' },
      ],
    });

    concept.update({ questions: [question1, question2] });

    concept.update({
      blocks: [
        {
          type: 'concept_question',
          args: {
            concept_question_slug: question1.slug,
          },
        },
      ],
    });

    await questionsPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await percySnapshot('Concept Admin - Question List');

    await questionsPage.clickOnQuestionCard('question-1');
    await percySnapshot('Concept Admin - Question Form');
  });
});
