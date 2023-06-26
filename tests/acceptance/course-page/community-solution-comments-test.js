import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | community-solution-comments', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view community solution comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server); // Move off of staff

    const python = this.server.schema.languages.findBy({ slug: 'python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const user = this.server.schema.users.first();

    const solution = createCommunityCourseStageSolution(this.server, redis, 2, python);

    this.server.create('community-course-stage-solution-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: solution,
      subtargetLocator: 'README.md:3-4',
      user: user,
    });

    this.server.create('community-course-stage-solution-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      target: solution,
      subtargetLocator: 'README.md:1-1',
      user: user,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    await coursePage.courseStageSolutionModal.languageDropdown.toggle();
    await coursePage.courseStageSolutionModal.languageDropdown.clickOnLink('Python');

    const communitySolutionsTab = coursePage.courseStageSolutionModal.communitySolutionsTab;

    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Solutions', 'active header tab link should be comments');
    assert.strictEqual(communitySolutionsTab.solutionCards.length, 1);

    await percySnapshot('Community Solution Comments - Collapsed');

    await communitySolutionsTab.solutionCards[0].clickOnExpandButton();
    assert.strictEqual(communitySolutionsTab.solutionCards[0].toggleCommentsButtons.length, 2);
    assert.strictEqual(communitySolutionsTab.solutionCards[0].commentCards.length, 0);

    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[0].click();
    assert.strictEqual(communitySolutionsTab.solutionCards[0].commentCards.length, 1);

    await percySnapshot('Community Solution Comments - Expanded');

    // Clicking 2nd button should collapse first and open 2nd
    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[1].click();
    assert.strictEqual(communitySolutionsTab.solutionCards[0].commentCards.length, 1);

    // Clicking 2nd button again should collapse 2nd
    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[1].click();
    assert.strictEqual(communitySolutionsTab.solutionCards[0].commentCards.length, 0);
  });

  test('can upvote / downvote comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server); // Move off of staff

    const python = this.server.schema.languages.findBy({ slug: 'python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const user = this.server.schema.users.first();

    const solution = createCommunityCourseStageSolution(this.server, redis, 2, python);

    this.server.create('community-course-stage-solution-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: solution,
      subtargetLocator: 'README.md:3-4',
      user: user,
    });

    this.server.create('community-course-stage-solution-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      target: solution,
      subtargetLocator: 'README.md:1-1',
      user: user,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    await coursePage.courseStageSolutionModal.languageDropdown.toggle();
    await coursePage.courseStageSolutionModal.languageDropdown.clickOnLink('Python');

    const communitySolutionsTab = coursePage.courseStageSolutionModal.communitySolutionsTab;

    await communitySolutionsTab.solutionCards[0].clickOnExpandButton();
    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[0].click();

    assert.strictEqual(communitySolutionsTab.solutionCards[0].commentCards.length, 1);

    const firstCommentCard = communitySolutionsTab.solutionCards[0].commentCards[0];
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

  test('can reply to comment', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server); // Move off of staff

    const python = this.server.schema.languages.findBy({ slug: 'python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const user = this.server.schema.users.first();

    const solution = createCommunityCourseStageSolution(this.server, redis, 2, python);

    this.server.create('community-course-stage-solution-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: solution,
      subtargetLocator: 'README.md:3-4',
      user: user,
    });

    this.server.create('community-course-stage-solution-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      target: solution,
      subtargetLocator: 'README.md:1-1',
      user: user,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();
    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    await coursePage.courseStageSolutionModal.languageDropdown.toggle();
    await coursePage.courseStageSolutionModal.languageDropdown.clickOnLink('Python');

    const communitySolutionsTab = coursePage.courseStageSolutionModal.communitySolutionsTab;
    const solutionCard = communitySolutionsTab.solutionCards[0];

    await solutionCard.clickOnExpandButton();
    await solutionCard.toggleCommentsButtons[0].click();

    const firstCommentCard = solutionCard.commentCards[0];
    await firstCommentCard.clickOnReplyButton();
    await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
    await firstCommentCard.commentForm.clickOnPostReplyButton();

    assert.strictEqual(solutionCard.commentCards.length, 2, '2 comments cards should be present');
  });

  // test('can delete comment', async function (assert) {
  //   testScenario(this.server);
  //   signIn(this.owner, this.server);

  //   await catalogPage.visit();
  //   await catalogPage.clickOnCourse('Build your own Redis');
  //   await courseOverviewPage.clickOnStartCourse();

  //   await coursePage.clickOnCollapsedItem('Respond to PING');
  //   await animationsSettled();

  //   await coursePage.activeCourseStageItem.clickOnActionButton('Hints');
  //   await coursePage.courseStageSolutionModal.commentsTab.fillInCommentInput('This is a comment');
  //   await coursePage.courseStageSolutionModal.commentsTab.clickOnSubmitButton();

  //   assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 1);

  //   const commentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];

  //   window.confirm = () => true;

  //   await commentCard.toggleDropdown();
  //   await commentCard.clickOnDropdownLink('Delete');

  //   assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 0);
  // });

  // test('can delete comment with replies', async function (assert) {
  //   testScenario(this.server);
  //   signIn(this.owner, this.server);

  //   await catalogPage.visit();
  //   await catalogPage.clickOnCourse('Build your own Redis');
  //   await courseOverviewPage.clickOnStartCourse();

  //   await coursePage.clickOnCollapsedItem('Respond to PING');
  //   await animationsSettled();

  //   await coursePage.activeCourseStageItem.clickOnActionButton('Hints');
  //   await coursePage.courseStageSolutionModal.commentsTab.fillInCommentInput('This is a comment');
  //   await coursePage.courseStageSolutionModal.commentsTab.clickOnSubmitButton();

  //   const firstCommentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];
  //   await firstCommentCard.clickOnReplyButton();
  //   await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
  //   await firstCommentCard.commentForm.clickOnPostReplyButton();

  //   assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 2, '2 comments cards should be present');

  //   const commentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];

  //   window.confirm = () => true;

  //   await commentCard.toggleDropdown();
  //   await commentCard.clickOnDropdownLink('Delete');

  //   assert.strictEqual(coursePage.courseStageSolutionModal.commentsTab.commentCards.length, 0, 'no comment cards should be present');
  // });

  // test('can reply to comments', async function (assert) {
  //   testScenario(this.server);
  //   signIn(this.owner, this.server);

  //   const redis = this.server.schema.courses.findBy({ slug: 'redis' });
  //   const user = this.server.schema.users.first();

  //   this.server.create('course-stage-comment', {
  //     createdAt: new Date('2022-01-02'),
  //     bodyMarkdown: 'This is the **first** comment',
  //     target: redis.stages.models.sortBy('position')[1],
  //     approvalStatus: 'approved',
  //     user: user,
  //   });

  //   this.server.create('course-stage-comment', {
  //     createdAt: new Date('2020-01-01'),
  //     bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
  //     target: redis.stages.models.sortBy('position')[1],
  //     approvalStatus: 'approved',
  //     user: user,
  //   });

  //   await catalogPage.visit();
  //   await catalogPage.clickOnCourse('Build your own Redis');
  //   await courseOverviewPage.clickOnStartCourse();

  //   await coursePage.clickOnCollapsedItem('Respond to PING');
  //   await animationsSettled();

  //   await coursePage.activeCourseStageItem.clickOnActionButton('Hints');

  //   const firstCommentCard = coursePage.courseStageSolutionModal.commentsTab.commentCards[0];
  //   await firstCommentCard.clickOnReplyButton();

  //   assert.ok(firstCommentCard.commentForm.isVisible, 'reply form should be visible');

  //   await percySnapshot('Course Stage Comments / Reply Form');

  //   await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
  //   await firstCommentCard.commentForm.clickOnPostReplyButton();

  //   assert.strictEqual(firstCommentCard.replyCards.length, 1, 'reply card should be visible');

  //   await firstCommentCard.clickOnReplyButton();
  //   await firstCommentCard.commentForm.commentInput.fillIn('This is a second reply');
  //   await firstCommentCard.commentForm.clickOnPostReplyButton();

  //   assert.strictEqual(firstCommentCard.replyCards.length, 2, 'reply card should be visible');
  // });

  // // TODO: Can delete comment with replies
});
