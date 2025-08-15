import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import window from 'ember-window-mock';
import { waitUntil } from '@ember/test-helpers';
import sinon from 'sinon';
import { settled } from '@ember/test-helpers';

module('Acceptance | course-page | code-examples | view-on-github', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(async function () {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let differentUser = this.server.create('user', {
        avatarUrl: 'https://github.com/sarupbanskota.png',
        createdAt: new Date(),
        githubUsername: 'sarupbanskota',
        username: 'sarupbanskota',
      });

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: differentUser,
    });

    this.solution = createCommunityCourseStageSolution(this.server, redis, 2, python, differentUser);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');
  });

  test('can view export on GitHub if none exists', async function (assert) {

    const focusSpy = sinon.spy();
    const openStub = sinon.stub(window, 'open').returns({ focus: focusSpy });

    assert.ok(codeExamplesPage.solutionCards[0].highlightedFileCards[0].hasViewOnGithubButton, 'Expect view on github button to be visible');
    
    try {
      await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    } catch (error) {
      console.log('Button click error:', error);
    }

    await settled();
    
    // Wait for export creation to complete
    await waitUntil(() => this.solution.exports.length > 0, { timeout: 2000 });

    console.log(this.solution.exports);
    console.log('openStub called:', openStub.called);
    console.log('openStub callCount:', openStub.callCount);

    assert.ok(openStub.calledOnce, 'window.open should be called once');
    assert.strictEqual(openStub.args[0][0], 'https://github.com/cc-code-examples/python-redis/blob/main/server.rb', 'should redirect to github with auto-login');
    assert.strictEqual(focusSpy.calledOnce, true, 'should focus the child window');
  });
});