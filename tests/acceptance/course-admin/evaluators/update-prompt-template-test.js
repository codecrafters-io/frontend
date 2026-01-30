import codeExampleEvaluatorPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluator-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | evaluators | update-prompt-template-test', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.course = this.server.schema.courses.findBy({ slug: 'redis' });
  });

  test('can update prompt template when evaluator is in draft status', async function (assert) {
    this.evaluator = this.server.create('community-solution-evaluator', {
      slug: 'relevance',
      promptTemplate: 'Is the code example relevant to the prompt?',
      status: 'draft',
    });

    await codeExampleEvaluatorPage.visit({ course_slug: this.course.slug, evaluator_slug: this.evaluator.slug });

    assert.strictEqual(
      codeExampleEvaluatorPage.promptTemplateSection.textareaValue,
      'Is the code example relevant to the prompt?',
      'Initial prompt template is shown',
    );
    assert.true(codeExampleEvaluatorPage.promptTemplateSection.isUpdateButtonDisabled, 'Update button is disabled when no changes');

    await codeExampleEvaluatorPage.promptTemplateSection.fillTextarea('New prompt template content');

    assert.false(codeExampleEvaluatorPage.promptTemplateSection.isUpdateButtonDisabled, 'Update button is enabled after making changes');

    await codeExampleEvaluatorPage.promptTemplateSection.clickOnUpdateButton();

    assert.strictEqual(this.evaluator.reload().promptTemplate, 'New prompt template content', 'Prompt template is updated in the database');
    assert.true(codeExampleEvaluatorPage.promptTemplateSection.isUpdateButtonDisabled, 'Update button is disabled after saving');
  });

  test('cannot update prompt template when evaluator is live', async function (assert) {
    this.evaluator = this.server.create('community-solution-evaluator', {
      slug: 'relevance',
      promptTemplate: 'Is the code example relevant to the prompt?',
      status: 'live',
    });

    await codeExampleEvaluatorPage.visit({ course_slug: this.course.slug, evaluator_slug: this.evaluator.slug });

    assert.true(codeExampleEvaluatorPage.promptTemplateSection.isUpdateButtonDisabled, 'Update button is disabled for live evaluators');
  });
});
