import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import windowMock from 'ember-window-mock';
import { currentURL, visit } from '@ember/test-helpers';
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | track-page | start-track', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('it display the start-track-button for anonymous user (Track without primer concept group)', async function (assert) {
    testScenario(this.server);

    await visit('/tracks/go');
    assert.ok(trackPage.hasStartTrackButton, 'start track button should be visible for anonymous users');

    await trackPage.clickOnStartTrackButton();

    assert.strictEqual(
      windowMock.location.href,
      `${windowMock.location.origin}/login?next=http%3A%2F%2Flocalhost%3A${window.location.port}%2Ftracks%2Fgo`,
      'should redirect to login URL',
    );
  });

  test('it display the start-track-button for anonymous user (Track with primer concept group)', async function (assert) {
    testScenario(this.server);

    const tcpOverviewConcept = createConceptFromFixture(this.server, tcpOverview);
    const networkProtocolsConcept = createConceptFromFixture(this.server, networkProtocols);

    const rustPrimerConceptGroup = this.server.create('concept-group', {
      author: this.server.schema.users.first(),
      description_markdown: 'Dummy description',
      concepts: [tcpOverviewConcept, networkProtocolsConcept],
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'rust-primer',
      title: 'Rust Primer',
    });

    const rust = this.server.schema.languages.findBy({ slug: 'rust' });
    rust.update({ primerConceptGroup: rustPrimerConceptGroup });

    await visit('/tracks/rust');
    assert.ok(trackPage.hasStartTrackButton, 'start track button should be visible for anonymous users');

    await trackPage.clickOnStartTrackButton();
    assert.strictEqual(currentURL(), '/concepts/tcp-overview');
  });

  // TODO: Bring this back once we can account for both concepts & challenges
  skip('it display the start-track-button for logged-in user who has not started course in the track', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/tracks/go');
    assert.ok(trackPage.hasStartTrackButton, 'start track button should be visible for users without course progress');
  });

  // TODO: Bring this back once we can account for both concepts & challenges
  skip('it does not display the start-track-button for logged-in user who has started course in the track', async function (assert) {
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

  // TODO: Bring this back once we can account for both concepts & challenges
  skip('it starts track for logged-in user who has started course in a different track', async function (assert) {
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
