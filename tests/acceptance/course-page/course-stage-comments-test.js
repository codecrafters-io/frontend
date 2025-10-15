import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | course-stage-comments', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: dummy.stages.models.sortBy('position')[1],
      user: user,
    });

    this.server.create('course-stage-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      target: dummy.stages.models.sortBy('position')[1],
      user: user,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      user: user,
      language: this.server.schema.languages.findBy({ slug: 'python' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    assert.strictEqual(coursePage.header.stepName, 'The first stage', 'title should be respond to ping');
    assert.strictEqual(coursePage.commentList.commentCards.length, 2);

    await percySnapshot('Course Stage Comments', {
      scope: '[data-percy-hints-section]',
      percyCss: '#course-page-scrollable-area { overflow-y: visible !important; }',
    });
  });

  test('can create comment', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('repository', 'withFirstStageCompleted', {
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ slug: 'python' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await animationsSettled();

    assert.strictEqual(coursePage.header.stepName, 'The first stage', 'title should be respond to ping');
    assert.ok(coursePage.commentList.submitButtonIsDisabled, 'submit button should be disabled if no input is provided');

    await coursePage.commentList.fillInCommentInput('This is a comment');
    assert.notOk(coursePage.commentList.submitButtonIsDisabled, 'submit button should not be disabled if input is provided');

    await coursePage.commentList.clickOnTabHeader('Preview');
    await percySnapshot('Course Stage Comments - Preview', {
      scope: '[data-percy-hints-section]',
      percyCss: '#course-page-scrollable-area { overflow-y: visible !important; }',
    });

    await coursePage.commentList.clickOnTabHeader('Write');
    await coursePage.commentList.clickOnSubmitButton();

    assert.strictEqual(coursePage.commentList.commentCards.length, 1);
  });

  test('can upvote / downvote comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      targetId: dummy.stages.models.sortBy('position')[1].id,
      targetType: 'course-stages',
      approvalStatus: 'approved',
      user: user,
    });

    this.server.create('course-stage-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      targetId: dummy.stages.models.sortBy('position')[1].id,
      targetType: 'course-stages',
      approvalStatus: 'approved',
      user: user,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ slug: 'python' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    const firstCommentCard = coursePage.commentList.commentCards[0];
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

    this.server.create('repository', 'withFirstStageCompleted', {
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ slug: 'python' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    await coursePage.commentList.fillInCommentInput('This is a comment');
    await coursePage.commentList.clickOnSubmitButton();

    assert.strictEqual(coursePage.commentList.commentCards.length, 1);

    const commentCard = coursePage.commentList.commentCards[0];

    await commentCard.toggleDropdown();
    await commentCard.clickOnDropdownLink('Edit');

    await percySnapshot('Course Stage Comments / Edit Form', {
      scope: '[data-percy-hints-section]',
      percyCss: '#course-page-scrollable-area { overflow-y: visible !important; }',
    });

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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    await coursePage.commentList.fillInCommentInput('This is a comment');
    await coursePage.commentList.clickOnSubmitButton();

    assert.strictEqual(coursePage.commentList.commentCards.length, 1);

    const commentCard = coursePage.commentList.commentCards[0];

    window.confirm = () => true;

    await commentCard.toggleDropdown();
    await commentCard.clickOnDropdownLink('Delete');

    assert.strictEqual(coursePage.commentList.commentCards.length, 0);
  });

  test('can delete comment with replies', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    await coursePage.commentList.fillInCommentInput('This is a comment');
    await coursePage.commentList.clickOnSubmitButton();

    const firstCommentCard = coursePage.commentList.commentCards[0];
    await firstCommentCard.clickOnReplyButton();
    await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
    await firstCommentCard.commentForm.clickOnPostReplyButton();

    assert.strictEqual(coursePage.commentList.commentCards.length, 2, '2 comments cards should be present');

    const commentCard = coursePage.commentList.commentCards[0];

    window.confirm = () => true;

    await commentCard.toggleDropdown();
    await commentCard.clickOnDropdownLink('Delete');

    assert.strictEqual(coursePage.commentList.commentCards.length, 0, 'no comment cards should be present');
  });

  test('can reply to comments', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: dummy.stages.models.sortBy('position')[1],
      approvalStatus: 'approved',
      user: user,
    });

    this.server.create('course-stage-comment', {
      createdAt: new Date('2020-01-01'),
      bodyMarkdown: "This is the _second_ comment, but it's longer. It's also **bold**. And long. Very very long should span more than one line.",
      target: dummy.stages.models.sortBy('position')[1],
      approvalStatus: 'approved',
      user: user,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      user: this.server.schema.users.first(),
      language: this.server.schema.languages.findBy({ slug: 'python' }),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    const firstCommentCard = coursePage.commentList.commentCards[0];
    await firstCommentCard.clickOnReplyButton();

    assert.ok(firstCommentCard.commentForm.isVisible, 'reply form should be visible');

    await percySnapshot('Course Stage Comments / Reply Form', {
      scope: '[data-percy-hints-section]',
      percyCss: '#course-page-scrollable-area { overflow-y: visible !important; }',
    });

    await firstCommentCard.commentForm.commentInput.fillIn('This is a reply');
    await firstCommentCard.commentForm.clickOnPostReplyButton();

    assert.strictEqual(firstCommentCard.replyCards.length, 1, 'reply card should be visible');

    await firstCommentCard.clickOnReplyButton();
    await firstCommentCard.commentForm.commentInput.fillIn('This is a second reply');
    await firstCommentCard.commentForm.clickOnPostReplyButton();

    assert.strictEqual(firstCommentCard.replyCards.length, 2, 'reply card should be visible');
  });

  // TODO: Can delete comment with replies
  test('comment has correct user label', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    const user = this.server.schema.users.first();

    this.server.create('course-stage-comment', {
      createdAt: new Date('2022-01-02'),
      bodyMarkdown: 'This is the **first** comment',
      target: dummy.stages.models.sortBy('position')[1],
      user: user,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    assert.false(coursePage.commentList.commentCards[0].userLabel.isPresent, 'should have no label if not staff or current course author');

    user.update({ isStaff: true });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    assert.strictEqual(coursePage.commentList.commentCards[0].userLabel.text, 'staff', 'should have staff label if staff');

    await coursePage.commentList.commentCards[0].userLabel.hover();
    assertTooltipContent(assert, {
      contentString: 'This user works at CodeCrafters',
    });

    user.update({ authoredCourseSlugs: ['dummy'] });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    assert.strictEqual(coursePage.commentList.commentCards[0].userLabel.text, 'staff', 'should have staff label if staff and course author');

    user.update({ isStaff: false });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    assert.strictEqual(
      coursePage.commentList.commentCards[0].userLabel.text,
      'challenge author',
      'should have challenge author label if comment is on authored course',
    );

    await coursePage.commentList.commentCards[0].userLabel.hover();
    assertTooltipContent(assert, {
      contentString: 'This user is the author of this challenge',
    });

    user.update({ authoredCourseSlugs: ['git'] });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The first stage');
    await animationsSettled();

    assert.false(
      coursePage.commentList.commentCards[0].userLabel.isPresent,
      'should not have challenge author label if comment is not on authored course',
    );
  });
});
