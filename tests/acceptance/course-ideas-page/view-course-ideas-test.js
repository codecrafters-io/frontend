import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import courseIdeasPage from 'codecrafters-frontend/tests/pages/course-ideas-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createCourseIdeas from 'codecrafters-frontend/mirage/utils/create-course-ideas';

module('Acceptance | course-ideas-page | view-course-ideas', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    createCourseIdeas(this.server);

    await courseIdeasPage.visit();
    await percySnapshot('Challenge Ideas');

    assert.strictEqual(1, 1);

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });

  test('it renders for logged in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    await courseIdeasPage.visit();
    // await this.pauseTest();
    await percySnapshot('Challenge Ideas');

    assert.strictEqual(1, 1);

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });
});
