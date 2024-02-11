import conceptPage from 'codecrafters-frontend/tests/pages/concept-page';
import conceptsPage from 'codecrafters-frontend/tests/pages/concepts-page';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import percySnapshot from '@percy/ember';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';

function createConcepts(server) {
  createConceptFromFixture(server, tcpOverview);
  createConceptFromFixture(server, networkProtocols);
}

module('Acceptance | concepts-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
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
    await conceptPage.questionCards[0].clickOnSubmitButton();
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

    await percySnapshot('Concept - Completed');
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
    await conceptPage.questionCards[0].clickOnSubmitButton();
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

  test('submit button does not work when no option is selected for question card', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);
    await conceptsPage.visit();
    await conceptsPage.clickOnConceptCard('Network Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    await conceptPage.questionCards[0].clickOnSubmitButton();
    assert.notOk(conceptPage.questionCards[0].hasSubmitted, 'The submission result should not be visible without selecting an option.');

    await conceptPage.questionCards[0].selectOption('PDF');
    await conceptPage.questionCards[0].clickOnSubmitButton();

    assert.ok(conceptPage.questionCards[0].hasSubmitted, 'After selecting an option, the submission result should be visible.');
  });

  test('progress is tracked', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();
    signIn(this.owner, this.server, user);

    await conceptsPage.visit();
    assert.notOk(conceptsPage.conceptCards[1].progress.isPresent, 'Progress bar should not be present in concept card before starting concept');

    await conceptsPage.conceptCards[1].hover();
    assert.strictEqual(conceptsPage.conceptCards[1].actionText, 'View', 'Concept card action text should be view');

    await conceptsPage.clickOnConceptCard('Network Protocols');
    assert.notOk(conceptPage.progress.isPresent, 'Progress bar should not be present in concept before starting');

    await conceptPage.clickOnContinueButton();
    assert.ok(conceptPage.progress.text.includes('5%'), 'Progress bar should reflect changes');

    await conceptsPage.visit();
    assert.ok(conceptsPage.conceptCards[1].progress.text.includes('5 % complete'), 'Progress should be tracked');

    await conceptsPage.conceptCards[1].hover();
    assert.strictEqual(
      conceptsPage.conceptCards[1].actionText,
      'Resume',
      'Concept card action text should be resume for concept that is in progress',
    );

    await conceptsPage.clickOnConceptCard('Network Protocols');

    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].selectOption('PDF');
    await conceptPage.questionCards[0].clickOnSubmitButton();
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

    assert.ok(conceptPage.progress.text.includes('100%'), 'Progress bar should reflect concept completion');

    await conceptsPage.visit();
    assert.notOk(conceptsPage.conceptCards[1].progress.isPresent, 'Concept card should not show progress');
    assert.ok(
      conceptsPage.conceptCards[1].text.includes('completed'),
      'Concept card should show completed instead of progress percentage on completion',
    );

    await conceptsPage.conceptCards[1].hover();
    assert.strictEqual(conceptsPage.conceptCards[1].actionText, 'View', 'Concept card action text should be view for completed concept');
  });

  test('progress is tracked and is rendered properly on page visit', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();
    const networkProtocolsConcept = this.server.schema.concepts.findBy({ slug: 'network-protocols' });

    const engagement = this.server.create('concept-engagement', {
      concept: networkProtocolsConcept,
      user,
      currentProgressPercentage: 5,
      lastActivityAt: new Date(),
      startedAt: new Date(),
    })

    signIn(this.owner, this.server, user);

    await conceptsPage.visit();
    assert.ok(conceptsPage.conceptCards[0].progress.text.includes('5 % complete'), 'Progress should be tracked');

    await conceptsPage.conceptCards[0].hover();
    assert.strictEqual(
      conceptsPage.conceptCards[0].actionText,
      'Resume',
      'Concept card action text should be resume for concept that is in progress',
    );

    await conceptsPage.clickOnConceptCard('Network Protocols');
    assert.ok(conceptPage.progress.text.includes('5%'), 'Progress bar should reflect changes');
  });
});
