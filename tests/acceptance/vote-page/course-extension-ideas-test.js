import votePage from 'codecrafters-frontend/tests/pages/vote-page';
import createCourseExtensionIdeas from 'codecrafters-frontend/mirage/utils/create-course-extension-ideas';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | vote-page | course-extension-ideas', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    createCourseExtensionIdeas(this.server);

    let courseExtensionIdea = this.server.schema.courseExtensionIdeas.findBy({ slug: 'redis-persistence' });

    courseExtensionIdea.update('votesCount', 1);

    await votePage.visitCourseExtensionIdeasTab();
    await percySnapshot('Challenge Extension Ideas (anonymous)');

    assert.strictEqual(votePage.selectedCourseName, 'Build your own Redis');
    assert.strictEqual(votePage.courseExtensionIdeaCards.length, 2);
    assert.strictEqual(votePage.findCourseExtensionIdeaCard(courseExtensionIdea.name).voteButtonText, '1 vote');

    const releasedIdeaCard = votePage.findCourseExtensionIdeaCard('Persistence');
    const notStartedIdeaCard = votePage.findCourseExtensionIdeaCard('Geospatial commands');

    assert.strictEqual(releasedIdeaCard.developmentStatusLabelText, 'released', 'released idea has label');
    assert.true(releasedIdeaCard.isGreyedOut, 'released idea is greyed out');

    assert.notEqual(notStartedIdeaCard.developmentStatusLabelText, 'released', 'not started idea has no label');
    assert.false(notStartedIdeaCard.isGreyedOut, 'not started idea is not greyed out');

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

  test('can vote', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseExtensionIdeas(this.server);

    await votePage.visitCourseExtensionIdeasTab();

    let courseExtensionIdeaCard = votePage.findCourseExtensionIdeaCard('Persistence');
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');

    await courseExtensionIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '1 vote', 'expected vote button to say 1 vote');

    await courseExtensionIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteButtonText, '0 votes', 'expected vote button to say 0 votes');
  });

  test('label has the correct tooltip text', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseExtensionIdeas(this.server);

    const persistenceCourseExtensionIdea = this.server.schema.courseExtensionIdeas.findBy({ name: 'Persistence' });
    persistenceCourseExtensionIdea.update('developmentStatus', 'released');

    const geospatialCourseExtensionIdea = this.server.schema.courseExtensionIdeas.findBy({ name: 'Geospatial commands' });
    geospatialCourseExtensionIdea.update('developmentStatus', 'in_progress');

    await votePage.visitCourseExtensionIdeasTab();

    let courseExtensionIdeaCard = votePage.findCourseExtensionIdeaCard('Geospatial commands');
    await courseExtensionIdeaCard.hoverOnDevelopmentStatusLabel();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge extension. Upvote this idea to be notified when it launches.",
    });

    await courseExtensionIdeaCard.clickOnVoteButton();
    await courseExtensionIdeaCard.hoverOnDevelopmentStatusLabel();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge extension. We'll notify you when it launches.",
    });

    await courseExtensionIdeaCard.clickOnVoteButton();

    courseExtensionIdeaCard = votePage.findCourseExtensionIdeaCard('Persistence');
    await courseExtensionIdeaCard.hoverOnDevelopmentStatusLabel();

    assertTooltipContent(assert, {
      contentString: 'This challenge extension is now available! Visit the catalog to try it out.',
    });
  });
});
