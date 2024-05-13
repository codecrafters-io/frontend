import conceptPage from 'codecrafters-frontend/tests/pages/concept-page';
import conceptsPage from 'codecrafters-frontend/tests/pages/concepts-page';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import dummy from 'codecrafters-frontend/mirage/concept-fixtures/dummy';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import percySnapshot from '@percy/ember';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';

function createConcepts(server) {
  createConceptFromFixture(server, tcpOverview);
  createConceptFromFixture(server, networkProtocols);
  createConceptFromFixture(server, dummy);
}

module('Acceptance | concepts-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('can create concept', async function (assert) {
    testScenario(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();
    await conceptsPage.clickOnCreateConceptButton();

    assert.strictEqual(currentURL(), '/concepts/new-concept/admin/basic-details');
  });

  test('can view concepts', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    this.server.schema.conceptGroups.create({
      conceptSlugs: ['network-protocols', 'tcp-overview'],
      descriptionMarkdown: 'This is a group about network concepts',
      slug: 'network-primer',
      title: 'Network Primer',
    });

    await conceptsPage.visit();

    await percySnapshot('Concept - Start');

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].selectOption('PDF');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[1].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[2].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[3].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.true(conceptPage.upcomingConcept.title.text.includes('Network Primer'), 'Concept group title is correct');
    assert.true(conceptPage.upcomingConcept.card.title.text.includes('TCP: An Overview'), 'Next concept title is correct');
    assert.true(conceptPage.shareConceptContainer.text.includes('https://app.codecrafters.io/concepts/network-protocols'));

    await percySnapshot('Concept - Completed');
  });

  test('anonymous users can also view concepts', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    this.server.schema.conceptGroups.create({
      conceptSlugs: ['network-protocols', 'tcp-overview'],
      descriptionMarkdown: 'This is a group about network concepts',
      slug: 'network-primer',
      title: 'Network Primer',
    });

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].selectOption('PDF');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[1].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[2].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[3].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.true(conceptPage.upcomingConcept.title.text.includes('Network Primer'), 'Concept group title is correct');
    assert.true(conceptPage.upcomingConcept.card.title.text.includes('TCP: An Overview'), 'Next concept title is correct');
  });

  test('clicking on the upcoming concept cards works properly', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    this.server.schema.conceptGroups.create({
      conceptSlugs: ['network-protocols', 'tcp-overview'],
      descriptionMarkdown: 'This is a group about network concepts',
      slug: 'network-primer',
      title: 'Network Primer',
    });

    await conceptsPage.visit();
    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].selectOption('PDF');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[1].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[2].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[3].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    await conceptPage.upcomingConcept.card.click();
    assert.strictEqual(currentURL(), '/concepts/tcp-overview', 'Clicking on the upcoming concept card navigates to the next concept');
    assert.strictEqual(conceptPage.blocks.length, 1, 'The progress is reset when navigating to a new concept');
    assert.strictEqual(window.scrollY, 0, 'The page is scrolled to the top when navigating to a new concept');
  });

  test('tracks concepts events', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');

    assert.strictEqual(filteredAnalyticsEvents.length, 8, 'Expected 8 analytics events to be tracked');

    assert.deepEqual(
      filteredAnalyticsEvents.map((event) => event.name),
      [
        'viewed_page',
        'viewed_page',
        'viewed_concept',
        'progressed_through_concept',
        'progressed_through_concept',
        'progressed_through_concept',
        'progressed_through_concept',
        'progressed_through_concept',
      ],
    );
  });

  test('tracks when share concept button is clicked', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Dummy Concept');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    await conceptPage.shareConceptContainer.clickOnCopyButton();

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('clicked_share_concept_button'), 'clicked_on_share_concept_button event should be tracked');
  });

  test('submit button does not work when no option is selected for question card', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);
    await conceptsPage.visit();
    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.notOk(conceptPage.questionCards[0].hasSubmitted, 'The submission result should not be visible without selecting an option.');

    await conceptPage.questionCards[0].selectOption('PDF');

    assert.ok(conceptPage.questionCards[0].hasSubmitted, 'After selecting an option, the submission result should be visible.');
  });

  test('progress is tracked', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();
    signIn(this.owner, this.server, user);

    await conceptsPage.visit();
    assert.notOk(conceptsPage.conceptCards[1].hasProgressBar, 'Progress bar should not be present in concept card before starting concept');

    await conceptsPage.conceptCards[1].hover();
    assert.strictEqual(conceptsPage.conceptCards[1].actionText, 'View', 'Concept card action text should be view');

    await conceptsPage.clickOnConceptCard('Network Protocols');
    assert.notOk(conceptPage.progress.isPresent, 'Progress bar should not be present in concept before starting');

    await conceptPage.clickOnContinueButton();
    assert.ok(conceptPage.progress.isPresent, 'Progress bar should be present after starting concept');
    assert.ok(conceptPage.progress.text.includes('5%'), 'Progress text should reflect tracked progress in concept page');
    assert.ok(conceptPage.progress.barStyle.includes('width: 5%'), 'Progress bar should reflect tracked progress in concept page');
    assert.ok(conceptPage.progress.text.includes('39 blocks left'), 'Remaining blocks left should be reflected properly');

    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].clickOnShowExplanationButton();
    assert.ok(conceptPage.progress.text.includes('10%'));
    assert.ok(conceptPage.progress.barStyle.includes('width: 10%'));

    await conceptPage.clickOnStepBackButton();
    assert.ok(conceptPage.progress.text.includes('5%'));
    assert.ok(conceptPage.progress.barStyle.includes('width: 5%'));

    await conceptsPage.visit();
    assert.ok(conceptsPage.conceptCards[1].progressText.includes('5% complete'), 'Progress text should reflect tracked progress in concept card');

    await conceptsPage.conceptCards[1].hover();
    assert.strictEqual(
      conceptsPage.conceptCards[1].actionText,
      'Resume',
      'Concept card action text should be resume for concept that is in progress',
    );
  });

  test('tracked progress is rendered properly on page visit', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();
    const networkProtocolsConcept = this.server.schema.concepts.findBy({ slug: 'network-protocols' });

    this.server.create('concept-engagement', {
      concept: networkProtocolsConcept,
      user,
      currentProgressPercentage: 5,
      lastActivityAt: new Date(),
      startedAt: new Date(),
    });

    signIn(this.owner, this.server, user);

    await conceptsPage.visit();
    assert.ok(conceptsPage.conceptCards[0].progressText.includes('5% complete'), 'Progress should be tracked');

    await conceptsPage.conceptCards[0].hover();
    assert.strictEqual(
      conceptsPage.conceptCards[0].actionText,
      'Resume',
      'Concept card action text should be resume for concept that is in progress',
    );

    await conceptsPage.clickOnConceptCard('Network Protocols');
    assert.strictEqual(conceptPage.blocks.length, 2, 'Completed blocks are automatically shown');
    assert.ok(conceptPage.progress.isPresent, 'Progress bar should be present');
    assert.ok(conceptPage.progress.text.includes('5%'), 'Progress text should reflect tracked progress in concept page');
    assert.ok(conceptPage.progress.barStyle.includes('width: 5%'), 'Progress bar should reflect tracked progress in concept page');
    assert.ok(conceptPage.progress.text.includes('39 blocks left'), 'Remaining blocks left should be reflected properly');
  });

  test('progress for completed concepts is rendered properly', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();
    const networkProtocolsConcept = this.server.schema.concepts.findBy({ slug: 'network-protocols' });

    this.server.create('concept-engagement', {
      concept: networkProtocolsConcept,
      user,
      currentProgressPercentage: 100,
      lastActivityAt: new Date(),
      startedAt: new Date(),
    });

    signIn(this.owner, this.server, user);

    await conceptsPage.visit();
    assert.notOk(conceptsPage.conceptCards[0].hasProgressBar, 'Concept card should not show progress');

    assert.ok(
      conceptsPage.conceptCards[0].text.includes('completed'),
      'Concept card should show completed instead of progress percentage on completion',
    );

    await conceptsPage.conceptCards[0].hover();
    assert.strictEqual(conceptsPage.conceptCards[0].actionText, 'View', 'Concept card action text should be view for completed concept');
  });

  test('remaining blocks left is rendered properly', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();
    signIn(this.owner, this.server, user);

    await conceptsPage.visit();
    await conceptsPage.clickOnConceptCard('Network Protocols');
    assert.notOk(conceptPage.progress.isPresent, 'Remaining blocks left should not be shown if no progress is made');

    await conceptPage.clickOnContinueButton();
    assert.contains(conceptPage.progress.text, '39 blocks left');

    await conceptPage.clickOnContinueButton();
    assert.contains(conceptPage.progress.text, '37 blocks left');
  });

  test('remaining blocks left is not present if user completed concept', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    this.server.schema.conceptGroups.create({
      conceptSlugs: ['network-protocols', 'tcp-overview'],
      descriptionMarkdown: 'This is a group about network concepts',
      slug: 'network-primer',
      title: 'Network Primer',
    });

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[1].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[2].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[3].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.notOk(conceptPage.progress.text.includes('blocks left'), 'Remaining blocks left should not be present');
  });

  test('can select an option for a question using 1/2/3/4', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    this.server.schema.conceptGroups.create({
      conceptSlugs: ['network-protocols', 'tcp-overview'],
      descriptionMarkdown: 'This is a group about network concepts',
      slug: 'network-primer',
      title: 'Network Primer',
    });

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.false(conceptPage.questionCards[0].hasSubmitted, 'the question has not been submitted yet');

    await conceptPage.questionCards[0].keydown({ key: '1' });

    assert.true(conceptPage.questionCards[0].hasSubmitted, 'the question has been submitted');
  });

  test('can select an option for a question using a/b/c/d', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    this.server.schema.conceptGroups.create({
      conceptSlugs: ['network-protocols', 'tcp-overview'],
      descriptionMarkdown: 'This is a group about network concepts',
      slug: 'network-primer',
      title: 'Network Primer',
    });

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.false(conceptPage.questionCards[0].hasSubmitted, 'the question has not been submitted yet');

    await conceptPage.questionCards[0].keydown({ keyCode: 65 });

    assert.true(conceptPage.questionCards[0].hasSubmitted, 'the question has been submitted');
  });

  test('can navigate using j/k and select option using enter', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.false(conceptPage.questionCards[0].hasSubmitted, 'the question has not been submitted yet');

    // Should be able to move back and fort
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'SMTP');
    await conceptPage.questionCards[0].keydown({ keyCode: 74 }); // Send j key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'HTTP');
    await conceptPage.questionCards[0].keydown({ keyCode: 75 }); // Send k key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'SMTP');

    // Can move to end of list
    await conceptPage.questionCards[0].keydown({ keyCode: 74 }); // Send j key
    await conceptPage.questionCards[0].keydown({ keyCode: 74 }); // Send j key
    await conceptPage.questionCards[0].keydown({ keyCode: 74 }); // Send j key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'PDF');

    // Can wrap around to start of list
    await conceptPage.questionCards[0].keydown({ keyCode: 74 }); // Send j key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'SMTP');

    await conceptPage.questionCards[0].focusedOption.click(); // Simulate ENTER on focused option
    assert.true(conceptPage.questionCards[0].hasSubmitted, 'the question has been submitted');
  });

  test('can navigate using arrow keys and select option using enter', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.false(conceptPage.questionCards[0].hasSubmitted, 'the question has not been submitted yet');

    // Should be able to move back and fort
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'SMTP');
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'HTTP');
    await conceptPage.questionCards[0].keydown({ key: 'ArrowUp' }); // Send up arrow key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'SMTP');

    // Can move to end of list
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'PDF');

    // Can wrap around to start of list
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    assert.strictEqual(conceptPage.questionCards[0].focusedOption.text, 'SMTP');

    await conceptPage.questionCards[0].focusedOption.click(); // Simulate ENTER on focused option
    assert.true(conceptPage.questionCards[0].hasSubmitted, 'the question has been submitted');
  });

  test('navigating question options using arrow keys does not trigger scrolling', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    const currentScrollY = window.scrollY;

    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key

    assert.strictEqual(window.scrollY, currentScrollY, 'scrolling should not be triggered');
  });

  test('navigating options wraps around the list for the current question card only', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].clickOnShowExplanationButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    assert.strictEqual(conceptPage.questionCards[1].focusedOption.text, '1 layer');

    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key
    await conceptPage.questionCards[0].keydown({ key: 'ArrowDown' }); // Send down arrow key

    assert.strictEqual(conceptPage.questionCards[1].focusedOption.text, '1 layer');
  });
});
