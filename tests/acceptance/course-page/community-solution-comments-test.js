import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
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

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    const communitySolutionsTab = coursePage.codeExamplesTab;

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING', 'title should be respond to ping');
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

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    const communitySolutionsTab = coursePage.codeExamplesTab;

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
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    const communitySolutionsTab = coursePage.codeExamplesTab;
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

  //   await coursePage.sidebar.clickOnStepListItem('Respond to PING');
  //   await animationsSettled();

  //   await coursePage.yourTaskCard.clickOnActionButton('Hints');
  //   await coursePage.commentList.fillInCommentInput('This is a comment');
  //   await coursePage.commentList.clickOnSubmitButton();

  //   assert.strictEqual(coursePage.commentList.commentCards.length, 1);

  //   const commentCard = coursePage.commentList.commentCards[0];

  //   window.confirm = () => true;

  //   await commentCard.toggleDropdown();
  //   await commentCard.clickOnDropdownLink('Delete');

  //   assert.strictEqual(coursePage.commentList.commentCards.length, 0);
  // });

  // test('can delete comment with replies', async function (assert) {
  //   testScenario(this.server);
  //   signIn(this.owner, this.server);

  //   await catalogPage.visit();
  //   await catalogPage.clickOnCourse('Build your own Redis');
  //   await courseOverviewPage.clickOnStartCourse();

  //   await coursePage.sidebar.clickOnStepListItem('Respond to PING');
  //   await animationsSettled();

  //   await coursePage.yourTaskCard.clickOnActionButton('Hints');
  //   await coursePage.commentList.fillInCommentInput('This is a comment');
  //   await coursePage.commentList.clickOnSubmitButton();

  //   const firstCommentCard = coursePage.commentList.commentCards[0];
  //   await firstCommentCard.clickOnReplyButton();
  //   await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
  //   await firstCommentCard.commentForm.clickOnPostReplyButton();

  //   assert.strictEqual(coursePage.commentList.commentCards.length, 2, '2 comments cards should be present');

  //   const commentCard = coursePage.commentList.commentCards[0];

  //   window.confirm = () => true;

  //   await commentCard.toggleDropdown();
  //   await commentCard.clickOnDropdownLink('Delete');

  //   assert.strictEqual(coursePage.commentList.commentCards.length, 0, 'no comment cards should be present');
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

  //   await coursePage.sidebar.clickOnStepListItem('Respond to PING');
  //   await animationsSettled();

  //   await coursePage.yourTaskCard.clickOnActionButton('Hints');

  //   const firstCommentCard = coursePage.commentList.commentCards[0];
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

  test('comment has correct user label', async function (assert) {
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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    const communitySolutionsTab = coursePage.codeExamplesTab;
    await communitySolutionsTab.solutionCards[0].clickOnExpandButton();

    assert.false(
      communitySolutionsTab.solutionCards[0].commentCards[0].userLabel.isPresent,
      'should have no label if not staff or current course author',
    );

    user.update({ isStaff: true });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    await communitySolutionsTab.solutionCards[0].clickOnExpandButton();
    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[0].click();

    assert.strictEqual(communitySolutionsTab.solutionCards[0].commentCards[0].userLabel.text, 'staff', 'should have staff label if staff');

    await communitySolutionsTab.solutionCards[0].commentCards[0].userLabel.hover();
    assertTooltipContent(assert, {
      contentString: 'This user works at CodeCrafters',
    });

    user.update({ authoredCourseSlugs: ['redis'] });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    await communitySolutionsTab.solutionCards[0].clickOnExpandButton();
    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[0].click();

    assert.strictEqual(
      communitySolutionsTab.solutionCards[0].commentCards[0].userLabel.text,
      'staff',
      'should have staff label if staff and course author',
    );

    user.update({ isStaff: false });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    await communitySolutionsTab.solutionCards[0].clickOnExpandButton();
    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[0].click();

    assert.strictEqual(
      communitySolutionsTab.solutionCards[0].commentCards[0].userLabel.text,
      'challenge author',
      'should have challenge author label if comment is on authored course',
    );

    await communitySolutionsTab.solutionCards[0].commentCards[0].userLabel.hover();
    assertTooltipContent(assert, {
      contentString: 'This user is the author of this challenge',
    });

    user.update({ authoredCourseSlugs: ['git'] });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    await communitySolutionsTab.solutionCards[0].clickOnExpandButton();
    await communitySolutionsTab.solutionCards[0].toggleCommentsButtons[0].click();

    assert.false(
      communitySolutionsTab.solutionCards[0].commentCards[0].userLabel.isPresent,
      'should not have challenge author label if comment is not on authored course',
    );
  });
});
