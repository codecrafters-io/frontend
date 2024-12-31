import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, visit } from '@ember/test-helpers';

module('Acceptance | track-page | start-track', function (hooks) {
  setupApplicationTest(hooks);

  test('it display the start-track-button for anonymous user', async function (assert) {
    testScenario(this.server);

    await visit('/tracks/go');
    assert.ok(trackPage.hasStartTrackButton, 'start track button should be visible for anonymous users');
  });

  test('it display the start-track-button for logged-in user who has not started course in the track', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/tracks/go');
    assert.ok(trackPage.hasStartTrackButton, 'start track button should be visible for users without course progress');
  });

  test('it does not display the start-track-button for logged-in user who has started course in the track', async function (assert) {
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
    assert.notOk(trackPage.hasStartTrackButton, 'start track button should not be visible for users with course progress');
  });

  test('it starts track for logged-in user who has started course in a different track', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let grep = this.server.schema.courses.findBy({ slug: 'grep' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });
    this.server.create('repository', 'withFirstStageCompleted', {
      course: grep,
      language: python,
      user: currentUser,
    });

    await visit('/tracks/go');
    assert.ok(trackPage.hasStartTrackButton, 'start track button is visible');

    await trackPage.clickOnStartTrackButton();
    assert.ok(currentURL().includes('track=go'), 'started course page should have `track` query param in URL');
    assert.notOk(currentURL().includes('repo='), 'started course page should not have `repo` query param in URL');
  });
});
