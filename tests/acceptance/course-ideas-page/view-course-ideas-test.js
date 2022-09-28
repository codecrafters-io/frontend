import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import courseIdeasPage from 'codecrafters-frontend/tests/pages/course-ideas-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createCourseIdeas from 'codecrafters-frontend/mirage/utils/create-course-ideas';

module('Acceptance | course-ideas-page | view-course-ideas', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    createCourseIdeas(this.server);

    let user = this.server.schema.users.first();
    let courseIdea = this.server.schema.courseIdeas.first();

    this.server.create('course-idea-vote', { user: user, courseIdea: courseIdea });

    await courseIdeasPage.visit();
    await percySnapshot('Challenge Ideas (anonymous)');

    assert.strictEqual(courseIdeasPage.findCourseIdeaCard(courseIdea.name).voteButtonText, '1 vote');

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });

  test('it renders for logged in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    await courseIdeasPage.visit();
    await percySnapshot('Challenge Ideas (logged in)');
    // await this.pauseTest();

    assert.strictEqual(1, 1);

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });

  test('can vote and supervote', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    let user = this.server.schema.users.first();
    this.server.create('course-idea-supervote-grant', { user: user, numberOfSupervotes: 2, description: 'completed the Redis challenge' });

    await courseIdeasPage.visit();

    let courseIdeaCard = courseIdeasPage.findCourseIdeaCard('Build your own Regex Parser');
    assert.strictEqual(courseIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');

    await courseIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');

    await courseIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');

    await courseIdeaCard.clickOnSupervoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');
    assert.strictEqual(courseIdeaCard.supervoteButtonText, '1 supervote +1', 'expected supervote button to say +1 vote');

    await courseIdeaCard.clickOnSupervoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');
    assert.strictEqual(courseIdeaCard.supervoteButtonText, '2 supervotes +2', 'expected supervote button to say +2 vote');

    await courseIdeaCard.clickOnSupervoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');
    assert.strictEqual(courseIdeaCard.supervoteButtonText, '2 supervotes +2', 'expected supervote button to say +2 vote');
    assert.strictEqual(courseIdeaCard.supervoteButtonTooltipText, "You're out of supervotes. Earn more by completing CodeCrafters challenges!");

    await courseIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');
    assert.strictEqual(courseIdeaCard.supervoteButtonText, '0 supervotes', 'expected supervote button to say 0 supervotes');
  });
});
