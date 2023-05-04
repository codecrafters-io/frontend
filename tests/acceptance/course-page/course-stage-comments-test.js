import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | course-stage-comments', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: redis.stages.models.sortBy('position')[1],
      user: user,
    });

    this.server.create('course-stage-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      target: redis.stages.models.sortBy('position')[1],
      user: user,
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');

    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Comments', 'active header tab link should be comments');
    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 2);

    await percySnapshot('Course Stage Comments');
  });

  test('can create comment', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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
    await percySnapshot('Course Stage Comments - Preview');

    await coursePage.courseStageSolutionModal.commentsTab.clickOnTabHeader('Write');
    await coursePage.courseStageSolutionModal.commentsTab.clickOnSubmitButton();

    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 1);
  });

  test('can upvote / downvote comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      targetId: redis.stages.models.sortBy('position')[1].id,
      targetType: 'course-stages',
      isApprovedByModerator: true,
      user: user,
    });

    this.server.create('course-stage-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      targetId: redis.stages.models.sortBy('position')[1].id,
      targetType: 'course-stages',
      isApprovedByModerator: true,
      user: user,
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');

    const firstCommentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];
    assert.strictEqual(firstCommentCard.upvoteButton.text, '1', 'upvote count should be 1');

    await firstCommentCard.upvoteButton.click();
    assert.strictEqual(firstCommentCard.upvoteButton.text, '2', 'upvote count should be 2');

    await firstCommentCard.upvoteButton.click();
    assert.strictEqual(firstCommentCard.upvoteButton.text, '1', 'upvote count should be 1');

    await firstCommentCard.downvoteButton.click();
    assert.strictEqual(firstCommentCard.upvoteButton.text, '0', 'upvote count should be 0');

    await firstCommentCard.downvoteButton.click();
    assert.strictEqual(firstCommentCard.upvoteButton.text, '1', 'upvote count should be 1');
  });

  test('can edit comment', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');
    await coursePage.courseStageSolutionModal.commentsTab.fillInCommentInput('This is a comment');
    await coursePage.courseStageSolutionModal.commentsTab.clickOnSubmitButton();

    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 1);

    const commentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];

    await commentCard.toggleDropdown();
    await commentCard.clickOnDropdownLink('Edit');

    await percySnapshot('Course Stage Comments / Edit Form');

    await commentCard.commentForm.commentInput.fillIn('This is an edited comment');
    await commentCard.commentForm.clickOnCancelButton();

    assert.strictEqual(commentCard.commentBodyText, 'This is a comment', 'comment input should be reset to original value');

    await commentCard.toggleDropdown();
    await commentCard.clickOnDropdownLink('Edit');
    await commentCard.commentForm.commentInput.fillIn('This is an edited comment');
    await commentCard.commentForm.clickOnUpdateCommentButton();

    assert.strictEqual(commentCard.commentBodyText, 'This is an edited comment', 'comment input should be updated');
  });

  test('can delete comment', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');
    await coursePage.courseStageSolutionModal.commentsTab.fillInCommentInput('This is a comment');
    await coursePage.courseStageSolutionModal.commentsTab.clickOnSubmitButton();

    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 1);

    const commentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];

    window.confirm = () => true;

    await commentCard.toggleDropdown();
    await commentCard.clickOnDropdownLink('Delete');

    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 0);
  });

  test('can delete comment with replies', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');
    await coursePage.courseStageSolutionModal.commentsTab.fillInCommentInput('This is a comment');
    await coursePage.courseStageSolutionModal.commentsTab.clickOnSubmitButton();

    const firstCommentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];
    await firstCommentCard.clickOnReplyButton();
    await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
    await firstCommentCard.commentForm.clickOnPostReplyButton();

    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 2, '2 comments cards should be present');

    const commentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];

    window.confirm = () => true;

    await commentCard.toggleDropdown();
    await commentCard.clickOnDropdownLink('Delete');

    assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 0, 'no comment cards should be present');
  });

  test('can reply to comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: redis.stages.models.sortBy('position')[1],
      isApprovedByModerator: true,
      user: user,
    });

    this.server.create('course-stage-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      target: redis.stages.models.sortBy('position')[1],
      isApprovedByModerator: true,
      user: user,
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Comments');

    const firstCommentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];
    await firstCommentCard.clickOnReplyButton();

    assert.ok(firstCommentCard.commentForm.isVisible, 'reply form should be visible');

    await percySnapshot('Course Stage Comments / Reply Form');

    await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
    await firstCommentCard.commentForm.clickOnPostReplyButton();

    assert.strictEqual(firstCommentCard.replyCards.length, 1, 'reply card should be visible');

    await firstCommentCard.clickOnReplyButton();
    await firstCommentCard.commentForm.commentInput.fillIn('This is a second reply');
    await firstCommentCard.commentForm.clickOnPostReplyButton();

    assert.strictEqual(firstCommentCard.replyCards.length, 2, 'reply card should be visible');
  });

  // TODO: Can delete comment with replies
});
