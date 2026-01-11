import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';

module('Integration | Component | course-admin/code-example-insights/metadata-container', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders vote counts when any votes are present', async function (assert) {
    this.set('solution', {
      addedLinesCount: 1,
      courseStage: { course: { testerVersions: [{ isLatest: true, tagName: 'v11' }] } },
      downvotesCount: 0,
      evaluations: [],
      flakinessCheckStatus: 'success',
      highlightedLinesCount: 3,
      removedLinesCount: 2,
      score: 1,
      scoreReason: 'concise',
      upvotesCount: 3,
      verifications: [],
    });

    await render(hbs`<CourseAdmin::CodeExampleInsights::MetadataContainer @solution={{this.solution}} />`);

    assert.ok(this.element.textContent.includes('3 upvotes, 0 downvotes'));
  });

  test('it omits vote counts when there are no votes', async function (assert) {
    this.set('solution', {
      addedLinesCount: 1,
      courseStage: { course: { testerVersions: [{ isLatest: true, tagName: 'v11' }] } },
      downvotesCount: 0,
      evaluations: [],
      flakinessCheckStatus: 'success',
      highlightedLinesCount: 3,
      removedLinesCount: 2,
      score: 1,
      scoreReason: 'concise',
      upvotesCount: 0,
      verifications: [],
    });

    await render(hbs`<CourseAdmin::CodeExampleInsights::MetadataContainer @solution={{this.solution}} />`);

    assert.notOk(this.element.textContent.includes('upvote'));
    assert.notOk(this.element.textContent.includes('downvote'));
  });
});
