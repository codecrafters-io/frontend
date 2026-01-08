import roadmapPage from 'codecrafters-frontend/tests/pages/roadmap-page';
import createCourseExtensionIdeas from 'codecrafters-frontend/mirage/utils/create-course-extension-ideas';
import createCourseIdeas from 'codecrafters-frontend/mirage/utils/create-course-ideas';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';
import { settled } from '@ember/test-helpers';

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
    assert.strictEqual(roadmapPage.courseExtensionIdeaCards.length, 6);
    assert.strictEqual(roadmapPage.findCourseExtensionIdeaCard(courseExtensionIdea.name).voteCountText, '1 vote');

    const releasedIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Persistence');
    const notStartedIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Geospatial commands');

    assert.strictEqual(releasedIdeaCard.developmentStatusPillText, 'Released', 'released idea has label');
    assert.true(releasedIdeaCard.isGreyedOut, 'released idea is greyed out');

    assert.notEqual(notStartedIdeaCard.developmentStatusPillText, 'Released', 'not started idea has no label');
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
    assert.strictEqual(courseExtensionIdeaCard.voteCountText, '0 votes', 'expected vote button to say 0 votes');

    await courseExtensionIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteCountText, '1 vote', 'expected vote button to say 1 vote');

    await courseExtensionIdeaCard.clickOnVoteButton();
    assert.strictEqual(courseExtensionIdeaCard.voteCountText, '0 votes', 'expected vote button to say 0 votes');
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
    await courseExtensionIdeaCard.hoverOnDevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge extension. Upvote this idea to be notified when it launches.",
    });

    await courseExtensionIdeaCard.clickOnVoteButton();
    await courseExtensionIdeaCard.hoverOnDevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: "We're currently building this challenge extension. We'll notify you when it launches.",
    });

    await courseExtensionIdeaCard.clickOnVoteButton();

    courseExtensionIdeaCard = roadmapPage.findCourseExtensionIdeaCard('Persistence');
    await courseExtensionIdeaCard.hoverOnDevelopmentStatusPill();

    assertTooltipContent(assert, {
      contentString: 'This challenge extension is now available! Visit the catalog to try it out.',
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

    createCourseExtensionIdeas(this.server);

    const persistence = this.server.schema.courseExtensionIdeas.findBy({ name: 'Persistence' });
    persistence.update('votesCount', 100);

    const geospatial = this.server.schema.courseExtensionIdeas.findBy({ name: 'Geospatial commands' });
    geospatial.update('votesCount', 15);

    const resp3 = this.server.schema.courseExtensionIdeas.findBy({ name: 'RESP3 Protocol' });
    resp3.update('votesCount', 10);

    const pubsub = this.server.schema.courseExtensionIdeas.findBy({ name: 'Pub/Sub' });
    pubsub.update('votesCount', 5);

    const lists = this.server.schema.courseExtensionIdeas.findBy({ name: 'Lists' });
    lists.update('votesCount', 12);

    const replication = this.server.schema.courseExtensionIdeas.findBy({ name: 'Replication' });
    replication.update('votesCount', 13);

    await roadmapPage.visitCourseExtensionIdeasTab();

    await percySnapshot('Course Extension Ideas (logged in) - sorted algorithmically');

    const courseExtensionIdeaCards = roadmapPage.courseExtensionIdeaCards;
    assert.strictEqual(courseExtensionIdeaCards.length, 6, 'should have 6 course extension idea cards');

    const cardOrder = courseExtensionIdeaCards.map((card) => card.name);

    // Note: The exact order depends on the algorithmic sorting, but we can verify that
    // in-progress ideas (RESP3 Protocol) come first, followed by not-started ideas
    const resp3Index = cardOrder.indexOf('RESP3 Protocol');
    const replicationIndex = cardOrder.indexOf('Replication');
    const pubsubIndex = cardOrder.indexOf('Pub/Sub');
    const geospatialIndex = cardOrder.indexOf('Geospatial commands');
    const listsIndex = cardOrder.indexOf('Lists');
    const persistenceIndex = cardOrder.indexOf('Persistence');

    // In-progress should come first (highest priority)
    assert.strictEqual(resp3Index, 0, 'in-progress idea should be first');

    // Not-started ideas should come after in-progress
    assert.true(replicationIndex > resp3Index, 'not-started ideas should come after in-progress');
    assert.true(pubsubIndex > resp3Index, 'not-started ideas should come after in-progress');
    assert.true(geospatialIndex > resp3Index, 'not-started ideas should come after in-progress');
    assert.true(listsIndex > resp3Index, 'not-started ideas should come after in-progress');

    // Released ideas should come last (lowest priority)
    assert.true(persistenceIndex > replicationIndex, 'released ideas should come after not-started');
    assert.true(persistenceIndex > pubsubIndex, 'released ideas should come after not-started');
    assert.true(persistenceIndex > geospatialIndex, 'released ideas should come after not-started');
    assert.true(persistenceIndex > listsIndex, 'released ideas should come after not-started');
  });

  test('it is sorted by votes count for anonymous user', async function (assert) {
    testScenario(this.server);
    createCourseExtensionIdeas(this.server);

    const persistence = this.server.schema.courseExtensionIdeas.findBy({ name: 'Persistence' });
    persistence.update('votesCount', 100);

    const geospatial = this.server.schema.courseExtensionIdeas.findBy({ name: 'Geospatial commands' });
    geospatial.update('votesCount', 15);

    const resp3 = this.server.schema.courseExtensionIdeas.findBy({ name: 'RESP3 Protocol' });
    resp3.update('votesCount', 10);

    const pubsub = this.server.schema.courseExtensionIdeas.findBy({ name: 'Pub/Sub' });
    pubsub.update('votesCount', 5);

    const lists = this.server.schema.courseExtensionIdeas.findBy({ name: 'Lists' });
    lists.update('votesCount', 12);

    const replication = this.server.schema.courseExtensionIdeas.findBy({ name: 'Replication' });
    replication.update('votesCount', 13);

    await roadmapPage.visitCourseExtensionIdeasTab();

    await percySnapshot('Course Extension Ideas (anonymous) - sorted by votes count');

    const courseExtensionIdeaCards = roadmapPage.courseExtensionIdeaCards;
    assert.strictEqual(courseExtensionIdeaCards.length, 6, 'should have 6 course extension idea cards');

    const cardOrder = courseExtensionIdeaCards.map((card) => card.name);

    // For anonymous users, ideas are sorted by development status priority first, then by vote count
    // in_progress (3) > not_started (2) > released (1)
    const expectedOrder = ['RESP3 Protocol', 'Geospatial commands', 'Replication', 'Lists', 'Pub/Sub', 'Persistence'];
    assert.deepEqual(cardOrder, expectedOrder, 'cards should be sorted by development status priority then vote count');
  });

  test('challenge dropdown functionality', async function (assert) {
    testScenario(this.server);
    createCourseExtensionIdeas(this.server);

    await roadmapPage.visitCourseExtensionIdeasTab();

    assert.strictEqual(roadmapPage.selectedCourseName, 'Build your own Redis');

    await roadmapPage.courseDropdown.toggle();

    await settled();

    await roadmapPage.courseDropdown.clickOnCourse('Build your own SQLite');

    assert.strictEqual(roadmapPage.selectedCourseName, 'Build your own SQLite');

    const courseExtensionIdeaCards = roadmapPage.courseExtensionIdeaCards;
    assert.true(courseExtensionIdeaCards.length > 0, 'should show course extension ideas for the selected challenge');

    const insertRowsCard = roadmapPage.findCourseExtensionIdeaCard('Insert rows');
    assert.ok(insertRowsCard, 'should show the "Insert rows" course extension idea for SQLite');
  });

  test('latest releases component is present', async function (assert) {
    testScenario(this.server);

    createCourseExtensionIdeas(this.server);
    createCourseIdeas(this.server);

    // Create a released item to test the component
    const courseExtensionIdea = this.server.schema.courseExtensionIdeas.findBy({ name: 'Persistence' });
    courseExtensionIdea.update({
      developmentStatus: 'released',
      releasedAt: new Date('2024-01-10'),
      announcementUrl: 'https://forum.codecrafters.io/t/redis-persistence-released',
    });

    // Update the associated course's shortName for the component to display correctly
    const redisCourse = courseExtensionIdea.course;
    redisCourse.update({ shortName: 'Redis' });

    await roadmapPage.visitCourseExtensionIdeasTab();
    await percySnapshot('Course Extension Ideas - Latest Releases');

    const releaseItems = roadmapPage.latestReleasesCard.releaseItems;
    assert.strictEqual(releaseItems.length, 3, 'should show 3 release items');
    assert.strictEqual(releaseItems[0].title, 'Redis / Persistence', 'should show the released extension');
    assert.strictEqual(releaseItems[1].title, 'Build your own Regex Parser', 'should show the released challenge');
    assert.strictEqual(releaseItems[2].title, 'Build your own SQLite', 'should show the released challenge');
  });
});
