import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, visit } from '@ember/test-helpers';

module('Acceptance | track-page | resume-track', function (hooks) {
  setupApplicationTest(hooks);

  test('it does not display the resume-track-button for anonymous user', async function (assert) {
    testScenario(this.server);

    await visit('/tracks/go');
    assert.notOk(trackPage.hasResumeTrackButton, 'resume track button should not be visible for anonymous users');
  });

  test('it does not display the resume-track-button for logged-in user who has not started course in the track', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/tracks/go');
    assert.notOk(trackPage.hasResumeTrackButton, 'resume track button should not be visible for users without course progress');
  });

  test('it resumes track for logged-in user who has started course in the track', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let git = this.server.schema.courses.findBy({ slug: 'git' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    this.server.create('repository', 'withFirstStageCompleted', {
      course: git,
      language: go,
      user: currentUser,
    });

    await visit('/tracks/go');
    assert.ok(trackPage.hasResumeTrackButton, 'resume track button is visible');

    await trackPage.clickOnResumeTrackButton();
    assert.ok(currentURL().startsWith('/courses/git/stages/ic4'), 'resumed course page shows correct URL path at stage 2');
  });
});
