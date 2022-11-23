import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL } from '@ember/test-helpers';

module('Acceptance | course-page | view-course-stage-comments', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view comments', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      courseStage: redis.stages.models.sortBy('position')[1],
      user: user,
    });

    this.server.create('course-stage-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      courseStage: redis.stages.models.sortBy('position')[1],
      user: user,
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');

    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Comments', 'active header tab link should be solutions');
    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 2);
  });

  test('can create comment', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');

    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Comments', 'active header tab link should be solutions');
    assert.ok(coursePage.courseStageSolutionModal.commentsTab.submitButtonIsDisabled, 'submit button should be disabled if no input is provided');

    await coursePage.courseStageSolutionModal.commentsTab.fillInCommentInput('This is a comment');
    assert.notOk(coursePage.courseStageSolutionModal.commentsTab.submitButtonIsDisabled, 'submit button should not be disabled if input is provided');

    await coursePage.courseStageSolutionModal.commentsTab.clickOnTabHeader('Preview');
  });
});
