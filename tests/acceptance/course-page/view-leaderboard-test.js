import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import signIn from 'codecrafters-frontend/tests/support/sign-in';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | view-leaderboard', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can view leaderboard when no recent players are present', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    let currentUser = this.owner.lookup('service:currentUser').record;

    assert.equal(coursePage.leaderboard.entries.length, 0, 'no leaderboard entries should be present by default');

    await coursePage.setupItem.clickOnLanguageButton('Python');

    assert.equal(coursePage.leaderboard.entries.length, 1, '1 leaderboard entry should be present once course has started');
    assert.equal(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to current user');
    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle until user pushes submission');
    assert.equal(coursePage.leaderboard.entries[0].progressText, '0 / 2', 'progress text must be shown');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmission: this.server.create('submission', { repository, status: 'evaluating' }) });

    await this.clock.tick(2001); // Wait for poll
    await finishRender();

    await this.clock.tick(2001); // Wait for transition
    await finishRender();

    this.server.schema.submissions.find(1).update({ status: 'failed' });

    await this.clock.tick(2001);
    await finishRender();

    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle once submission is done evaluating');
    assert.equal(coursePage.leaderboard.entries[0].progressText, '0 / 2', 'progress text must still be 0 if first stage is not completed');

    repository.update({ lastSubmission: this.server.create('submission', { repository, status: 'evaluating' }) });

    await this.clock.tick(2001);
    await finishRender();

    assert.ok(coursePage.leaderboard.entries[0].statusIsActive, 'leaderboard entry should be active if new submission is present evaluating');
    assert.equal(coursePage.leaderboard.entries[0].progressText, '0 / 2', 'progress text must still be 0 if first stage is not completed');

    this.server.schema.submissions.find(2).update({ status: 'success' });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: repository.course.stages.models.find((x) => x.position === 1),
    });

    await this.clock.tick(2001); // Poll
    await finishRender();

    await this.clock.tick(2001); // Transition
    await finishRender();

    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle after completing a stage');
    assert.equal(coursePage.leaderboard.entries[0].progressText, '1 / 2', 'progress text must still be 0 if first stage is not completed');
  });
});
