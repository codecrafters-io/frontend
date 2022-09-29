import votePage from 'codecrafters-frontend/tests/pages/vote-page';
import createCourseExtensionIdeas from 'codecrafters-frontend/mirage/utils/create-course-extension-ideas';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | vote-page | course-extension-ideas', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    createCourseExtensionIdeas(this.server);

    let user = this.server.schema.users.first();
    let courseExtensionIdea = this.server.schema.courseExtensionIdeas.findBy({ slug: 'redis-persistence' });

    this.server.create('course-extension-idea-vote', { user: user, courseExtensionIdea: courseExtensionIdea });

    await votePage.visitCourseExtensionIdeasTab();
    await percySnapshot('Challenge Extension Ideas (anonymous)');

    assert.strictEqual(votePage.selectedCourseName, 'Build your own Redis');
    assert.strictEqual(votePage.courseExtensionIdeaCards.length, 2);
    assert.strictEqual(votePage.findCourseExtensionIdeaCard(courseExtensionIdea.name).voteButtonText, '1 vote');

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });

  test('it renders for logged in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseExtensionIdeas(this.server);

    await votePage.visitCourseExtensionIdeasTab();
    await percySnapshot('Challenge Extension Ideas (logged in)');

    assert.strictEqual(1, 1);
  });

  test('can vote and supervote', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseExtensionIdeas(this.server);

    let user = this.server.schema.users.first();
    this.server.create('course-extension-idea-supervote-grant', { user: user, numberOfSupervotes: 2, description: 'completed the Redis challenge' });

    await votePage.visitCourseExtensionIdeasTab();

    let courseExtensionIdeaCard = votePage.findCourseExtensionIdeaCard('Persistence');
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');

    await courseExtensionIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');

    await courseExtensionIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');

    await courseExtensionIdeaCard.clickOnSupervoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');
    assert.strictEqual(courseExtensionIdeaCard.supervoteButtonText, '1 supervote +1', 'expected supervote button to say +1 vote');

    await courseExtensionIdeaCard.clickOnSupervoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');
    assert.strictEqual(courseExtensionIdeaCard.supervoteButtonText, '2 supervotes +2', 'expected supervote button to say +2 vote');

    await courseExtensionIdeaCard.clickOnSupervoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');
    assert.strictEqual(courseExtensionIdeaCard.supervoteButtonText, '2 supervotes +2', 'expected supervote button to say +2 vote');
    assert.strictEqual(
      courseExtensionIdeaCard.supervoteButtonTooltipText,
      "You're out of supervotes. Earn more by completing CodeCrafters challenges!"
    );

    await courseExtensionIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');
    assert.strictEqual(courseExtensionIdeaCard.supervoteButtonText, '0 supervotes', 'expected supervote button to say 0 supervotes');
  });
});
