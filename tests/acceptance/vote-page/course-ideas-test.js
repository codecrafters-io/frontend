import votePage from 'codecrafters-frontend/tests/pages/vote-page';
import createCourseIdeas from 'codecrafters-frontend/mirage/utils/create-course-ideas';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | vote-page | course-ideas', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    createCourseIdeas(this.server);

    let courseIdea = this.server.schema.courseIdeas.first();
    courseIdea.update({ votesCount: 1 });

    await votePage.visit();
    await percySnapshot('Challenge Ideas (anonymous)');

    assert.strictEqual(votePage.findCourseIdeaCard(courseIdea.name).voteButtonText, '1 vote');

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
    // TODO: Can navigate directly to course extension ideas
  });

  test('it renders for logged in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    await votePage.visit();
    await percySnapshot('Challenge Ideas (logged in)');

    assert.strictEqual(1, 1);

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });

  test('can vote', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    await votePage.visit();

    let courseIdeaCard = votePage.findCourseIdeaCard('Build your own Regex Parser');
    assert.strictEqual(courseIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');

    await courseIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');

    await courseIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');
  });

  test('label has the correct tooltip text', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    const regexCourseIdea = this.server.schema.courseIdeas.findBy({ name: 'Build your own Regex Parser' });
    regexCourseIdea.update('developmentStatus', 'in_progress');
    const sqliteCourseIdea = this.server.schema.courseIdeas.findBy({ name: 'Build your own SQLite' });
    sqliteCourseIdea.update('developmentStatus', 'released');

    await votePage.visit();

    let courseIdeaCard = votePage.findCourseIdeaCard('Build your own Regex Parser');
    await courseIdeaCard.hoverOnDevelopmentStatusLabel();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge. Upvote this idea to be notified when it launches.",
    });

    await courseIdeaCard.clickOnVoteButton();
    await courseIdeaCard.hoverOnDevelopmentStatusLabel();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge. We'll notify you when it launches.",
    });

    await courseIdeaCard.clickOnVoteButton();

    courseIdeaCard = votePage.findCourseIdeaCard('Build your own SQLite');
    await courseIdeaCard.hoverOnDevelopmentStatusLabel();

    assertTooltipContent(assert, {
      contentString: 'This challenge is now available! Visit the catalog to try it out.',
    });
  });
});
