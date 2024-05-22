import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { module, test } from 'qunit';

module('Acceptance | course-page | vote-for-code-examples', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can upvote code examples', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let otherUserOne = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    let otherUserTwo = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    let otherUserOneSolution = createCommunityCourseStageSolution(this.server, redis, 2, go);
    otherUserOneSolution.update({ user: otherUserOne });
    let otherUserTwoSolution = createCommunityCourseStageSolution(this.server, redis, 2, go);
    otherUserTwoSolution.update({ user: otherUserTwo });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    await coursePage.codeExamplesTab.solutionCards[0].upvoteButton.hover();

    assertTooltipContent(assert, {
      contentString: "Upvote this example and we'll show it more often.",
    });

    await coursePage.codeExamplesTab.solutionCards[0].upvoteButton.click();

    let upvote = this.server.schema.upvotes.all().models[0];
    assert.strictEqual(upvote.targetId, otherUserOneSolution.id, 'clicking on upvote button creates an upvote model');
  });

  test('can downvote code examples', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let otherUserOne = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    let otherUserTwo = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    let otherUserOneSolution = createCommunityCourseStageSolution(this.server, redis, 2, go);
    otherUserOneSolution.update({ user: otherUserOne });
    let otherUserTwoSolution = createCommunityCourseStageSolution(this.server, redis, 2, go);
    otherUserTwoSolution.update({ user: otherUserTwo });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    await coursePage.codeExamplesTab.solutionCards[0].downvoteButton.hover();

    assertTooltipContent(assert, {
      contentString: "Downvote this example and we'll show it less often.",
    });

    await coursePage.codeExamplesTab.solutionCards[0].downvoteButton.click();

    let downvote = this.server.schema.downvotes.all().models[0];
    assert.strictEqual(downvote.targetId, otherUserOneSolution.id, 'clicking on downvote button creates a downvote model');
  });
});
