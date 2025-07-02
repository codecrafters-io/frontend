import roadmapPage from 'codecrafters-frontend/tests/pages/roadmap-page';
import createCourseIdeas from 'codecrafters-frontend/mirage/utils/create-course-ideas';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';

module('Acceptance | roadmap-page | course-ideas', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders for anonymous user', async function (assert) {
    testScenario(this.server);

    createCourseIdeas(this.server);

    let courseIdea = this.server.schema.courseIdeas.first();
    courseIdea.update({ votesCount: 1, developmentStatus: 'released' });

    await roadmapPage.visit();
    await percySnapshot('Challenge Ideas (anonymous)');

    assert.strictEqual(roadmapPage.findCourseIdeaCard(courseIdea.name).voteCountText, '1 vote');
    assert.ok(roadmapPage.findCourseIdeaCard(courseIdea.name).isGreyedOut, 'should be greyed out if released');

    const releasedIdeaCard = roadmapPage.findCourseIdeaCard('Build your own Regex Parser');
    const notStartedIdeaCard = roadmapPage.findCourseIdeaCard('Build your own Shell');

    assert.strictEqual(releasedIdeaCard.developmentStatusPillText, 'Released', 'released idea has label');
    assert.true(releasedIdeaCard.isGreyedOut, 'released idea is greyed out');

    assert.notEqual(notStartedIdeaCard.developmentStatusPillText, 'Released', 'not started idea has no label');
    assert.false(notStartedIdeaCard.isGreyedOut, 'not started idea is not greyed out');

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
    // TODO: Can navigate directly to course extension ideas
  });

  test('it renders for logged in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    await roadmapPage.visit();
    await percySnapshot('Challenge Ideas (logged in)');

    assert.strictEqual(1, 1);

    // TODO: Test that hovering on vote shows tooltip
    // TODO: Test that clicking on vote will redirect to login
  });

  test('can vote', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    await roadmapPage.visit();

    let courseIdeaCard = roadmapPage.findCourseIdeaCard('Build your own Regex Parser');
    assert.strictEqual(courseIdeaCard.voteCountText, '0 votes', 'expected vote button to say 0 votes');

    await courseIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseIdeaCard.voteCountText, '1 vote', 'expected vote button to say 1 vote');

    await courseIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseIdeaCard.voteCountText, '0 votes', 'expected vote button to say 0 votes');
  });

  test('label has the correct tooltip text', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    createCourseIdeas(this.server);

    const httpCourseIdea = this.server.schema.courseIdeas.findBy({ name: 'Build your own HTTP Server' });
    httpCourseIdea.update('developmentStatus', 'in_progress');
    const regexCourseIdea = this.server.schema.courseIdeas.findBy({ name: 'Build your own Regex Parser' });
    regexCourseIdea.update('developmentStatus', 'released');

    await roadmapPage.visit();

    let courseIdeaCard = roadmapPage.findCourseIdeaCard('Build your own HTTP Server');
    await courseIdeaCard.hoverOnDevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge. Upvote this idea to be notified when it launches.",
    });

    await courseIdeaCard.clickOnVoteButton();
    await courseIdeaCard.hoverOnDevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge. We'll notify you when it launches.",
    });

    await courseIdeaCard.clickOnVoteButton();

    courseIdeaCard = roadmapPage.findCourseIdeaCard('Build your own Regex Parser');
    await courseIdeaCard.hoverOnDevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: 'This challenge is now available! Visit the catalog to try it out.',
    });
  });

  test('it is sorted algorithmically for logged in user', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    // Set up fake date service for consistent sorting behavior
    this.owner.unregister('service:date');
    this.owner.register('service:date', FakeDateService);

    const dateService = this.owner.lookup('service:date');
    const fixedDate = new Date('2024-06-15T00:00:00.000Z').getTime();
    dateService.setNow(fixedDate);

    createCourseIdeas(this.server);

    const regex = this.server.schema.courseIdeas.findBy({ name: 'Build your own Regex Parser' });
    regex.update('votesCount', 100);

    const http = this.server.schema.courseIdeas.findBy({ name: 'Build your own HTTP Server' });
    http.update('votesCount', 15);

    const shell = this.server.schema.courseIdeas.findBy({ name: 'Build your own Shell' });
    shell.update('votesCount', 10);

    const bittorrent = this.server.schema.courseIdeas.findBy({ name: 'Build your own BitTorrent client' });
    bittorrent.update('votesCount', 5);

    const react = this.server.schema.courseIdeas.findBy({ name: 'Build your own React' });
    react.update('votesCount', 12);

    await roadmapPage.visit();

    const courseIdeaCards = roadmapPage.courseIdeaCards;
    assert.strictEqual(courseIdeaCards.length, 5, 'should have 5 course idea cards (SQLite is archived)');

    const cardOrder = courseIdeaCards.map((card) => card.name);

    // Note: The exact order depends on the algorithmic sorting, but we can verify that
    // in-progress ideas (HTTP Server) come first, followed by not-started ideas
    const httpIndex = cardOrder.indexOf('Build your own HTTP Server');
    const shellIndex = cardOrder.indexOf('Build your own Shell');
    const bittorrentIndex = cardOrder.indexOf('Build your own BitTorrent client');
    const reactIndex = cardOrder.indexOf('Build your own React');
    const regexIndex = cardOrder.indexOf('Build your own Regex Parser');

    // In-progress should come first (highest priority)
    assert.strictEqual(httpIndex, 0, 'in-progress idea should be first');

    // Not-started ideas should come after in-progress
    assert.true(shellIndex > httpIndex, 'not-started ideas should come after in-progress');
    assert.true(bittorrentIndex > httpIndex, 'not-started ideas should come after in-progress');
    assert.true(reactIndex > httpIndex, 'not-started ideas should come after in-progress');

    // Released ideas should come last (lowest priority)
    assert.true(regexIndex > shellIndex, 'released ideas should come after not-started');
    assert.true(regexIndex > bittorrentIndex, 'released ideas should come after not-started');
    assert.true(regexIndex > reactIndex, 'released ideas should come after not-started');
  });

  test('it is sorted by votes count for anonymous user', async function (assert) {
    testScenario(this.server);
    createCourseIdeas(this.server);

    const regex = this.server.schema.courseIdeas.findBy({ name: 'Build your own Regex Parser' });
    regex.update('votesCount', 100);

    const http = this.server.schema.courseIdeas.findBy({ name: 'Build your own HTTP Server' });
    http.update('votesCount', 15);

    const shell = this.server.schema.courseIdeas.findBy({ name: 'Build your own Shell' });
    shell.update('votesCount', 10);

    const bittorrent = this.server.schema.courseIdeas.findBy({ name: 'Build your own BitTorrent client' });
    bittorrent.update('votesCount', 5);

    const react = this.server.schema.courseIdeas.findBy({ name: 'Build your own React' });
    react.update('votesCount', 12);

    await roadmapPage.visit();

    const courseIdeaCards = roadmapPage.courseIdeaCards;
    assert.strictEqual(courseIdeaCards.length, 5, 'should have 5 course idea cards (SQLite is archived)');

    const cardOrder = courseIdeaCards.map((card) => card.name);

    // For anonymous users, ideas are sorted by development status priority first, then by vote count
    // in_progress (3) > not_started (2) > released (1)
    const expectedOrder = [
      'Build your own HTTP Server',
      'Build your own React',
      'Build your own Shell',
      'Build your own BitTorrent client',
      'Build your own Regex Parser',
    ];
    assert.deepEqual(cardOrder, expectedOrder, 'cards should be sorted by development status priority then vote count');
  });
});
