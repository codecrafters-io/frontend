import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { triggerKeyEvent, waitUntil } from '@ember/test-helpers';

module('Acceptance | course-page | test-results-bar | toggle-with-shortcut-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('can toggle test results bar using Cmd+J', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withEvaluatingStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[0],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.testResultsBar.contents.height, 0, 'Test results bar is initially collapsed');

    await triggerKeyEvent(window, 'keydown', 74, { metaKey: true });
    await waitUntil(() => coursePage.testResultsBar.contents.height > 0);

    await triggerKeyEvent(window, 'keydown', 74, { metaKey: true });
    await waitUntil(() => coursePage.testResultsBar.contents.height === 0);

    assert.ok(true, 'Toggling via shortcut works');
  });
});
