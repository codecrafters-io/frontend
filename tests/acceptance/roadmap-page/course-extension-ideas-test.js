import roadmapPage from 'codecrafters-frontend/tests/pages/roadmap-page';
import createCourseExtensionIdeas from 'codecrafters-frontend/mirage/utils/create-course-extension-ideas';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | roadmap-page | course-extension-ideas', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    createCourseExtensionIdeas(this.server);

    let courseExtensionIdea = this.server.schema.courseExtensionIdeas.findBy({ slug: 'redis-persistence' });

    courseExtensionIdea.update('votesCount', 1);

    await roadmapPage.visitCourseExtensionIdeasTab();
    await percySnapshot('Challenge Extension Ideas (anonymous)');

    assert.strictEqual(roadmapPage.selectedCourseName, 'Build your own Redis');
    assert.strictEqual(roadmapPage.courseExtensionIdeaCards.length, 2);
    assert.strictEqual(roadmapPage.findCourseExtensionIdeaCard(courseExtensionIdea.name).voteButtonText, '1 vote');

    const releasedIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Persistence');
    const notStartedIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Geospatial commands');

    assert.strictEqual(releasedIdeaCard.developmentStatusPillText, 'released', 'released idea has label');
    assert.true(releasedIdeaCard.isGreyedOut, 'released idea is greyed out');

    assert.notEqual(notStartedIdeaCard.developmentStatusPillText, 'released', 'not started idea has no label');
    assert.false(notStartedIdeaCard.isGreyedOut, 'not started idea is not greyed out');

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });

  test('it renders for logged in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseExtensionIdeas(this.server);

    await roadmapPage.visitCourseExtensionIdeasTab();
    await percySnapshot('Challenge Extension Ideas (logged in)');

    assert.strictEqual(1, 1);
  });

  test('can vote', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseExtensionIdeas(this.server);

    await roadmapPage.visitCourseExtensionIdeasTab();

    let courseExtensionIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Persistence');
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

    await roadmapPage.visitCourseExtensionIdeasTab();

    let courseExtensionIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Geospatial commands');
    await courseExtensionIdeaCard.hoverOndevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge extension. Upvote this idea to be notified when it launches.",
    });

    await courseExtensionIdeaCard.clickOnVoteButton();
    await courseExtensionIdeaCard.hoverOndevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge extension. We'll notify you when it launches.",
    });

    await courseExtensionIdeaCard.clickOnVoteButton();

    courseExtensionIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Persistence');
    await courseExtensionIdeaCard.hoverOndevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: 'This challenge extension is now available! Visit the catalog to try it out.',
    });
  });
});
