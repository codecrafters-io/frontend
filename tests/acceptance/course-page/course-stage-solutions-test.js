import { setupAnimationTest, animationsSettled } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import percySnapshot from '@percy/ember';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';

module('Acceptance | course-page | course-stage-solutions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  hooks.beforeEach(async function () {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('course-stage-solution', {
      changedFiles: [
        {
          diff: '@@ -1,10 +1,11 @@\n import socket  # noqa: F401\n\n\n def main():\n     server_socket = socket.create_server(("localhost", 6379), reuse_port=True)\n-    server_socket.accept() # wait for client\n+    connection, _ = server_socket.accept()\n+    connection.sendall(b"+PONG\\r\\n")\n\n\n if __name__ == "__main__":\n     main()\n',
          filename: 'app/main.py',
        },
      ],
      courseStage: dummy.stages.models.sortBy('position')[1],
      language: python,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();
  });

  test('can view solution', async function (assert) {
    assert.ok(coursePage.secondStageYourTaskCard.hasFileDiffCard, 'Expect file diff card to be visible');

    assert.ok(coursePage.secondStageYourTaskCard.hasSolutionBlurredOverlay, 'Expect solution blurred overlay to be visible');
    assert.ok(coursePage.secondStageYourTaskCard.hasRevealSolutionButton, 'Expect reveal solution button to be visible');
    assert.notOk(coursePage.secondStageYourTaskCard.hasHideSolutionButton, 'Expect hide solution button to be hidden');
    await percySnapshot('Second Stage Solution - Before Reveal');

    await coursePage.secondStageYourTaskCard.clickOnSolutionBlurredOverlay();
    await animationsSettled();
    assert.notOk(coursePage.secondStageYourTaskCard.hasSolutionBlurredOverlay, 'Expect solution blurred overlay to be hidden');
    assert.notOk(coursePage.secondStageYourTaskCard.hasRevealSolutionButton, 'Expect reveal solution button to be hidden');
    assert.ok(coursePage.secondStageYourTaskCard.hasHideSolutionButton, 'Expect hide solution button to be visible');
    await percySnapshot('Second Stage Solution - After Reveal');

    await coursePage.secondStageYourTaskCard.clickOnHideSolutionButton();
    await animationsSettled();
    assert.ok(coursePage.secondStageYourTaskCard.hasSolutionBlurredOverlay, 'Expect solution blurred overlay to be visible');
    assert.ok(coursePage.secondStageYourTaskCard.hasRevealSolutionButton, 'Expect reveal solution button to be visible');
    assert.notOk(coursePage.secondStageYourTaskCard.hasHideSolutionButton, 'Expect hide solution button to be hidden');
    await percySnapshot('Second Stage Solution - After Hide');
  });
});
