import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest, animationsSettled } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitUntil } from '@ember/test-helpers';

module('Acceptance | course-page | leaderboard-progress', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can complete first stage', async function (assert) {
    testScenario(this.server, ['dummy']);
    const currentUser = signIn(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    // Fill in questionnaire
    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();

    assert.strictEqual(coursePage.trackLeaderboard.titleText.toUpperCase(), 'PYTHON LEADERBOARD', 'track leaderboard title is shown');
    assert.strictEqual(coursePage.trackLeaderboard.rows.length, 0, 'no leaderboard rows are shown to start (no users have attempted the track yet)');

    // Fill in questionnaire
    await coursePage.createRepositoryCard.clickOnOptionButton('Advanced');
    await animationsSettled();
    await coursePage.createRepositoryCard.clickOnOptionButton('Every day');
    await animationsSettled();
    await coursePage.createRepositoryCard.clickOnOptionButton('Yes please');
    await animationsSettled();
    await coursePage.createRepositoryCard.clickOnContinueButton();

    // Succesful first submission
    this.server.create('submission', 'withSuccessStatus', {
      repository: this.server.schema.repositories.find(1),
      courseStage: course.stages.models.find((stage) => stage.position === 1),
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    await coursePage.setupStepCompleteModal.clickOnNextButton();
    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');

    await waitUntil(() => coursePage.currentStepCompleteModal.languageLeaderboardRankSection.rankText === '#1', {}, 'current user is ranked #1');
    assert.strictEqual(coursePage.trackLeaderboard.rows.length, 1, '1 leaderboard row is shown for the current user');
  });
});
