import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import conceptsPage from 'codecrafters-frontend/tests/pages/concepts-page';
import conceptPage from 'codecrafters-frontend/tests/pages/concept-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

function createConcepts(server) {
  server.create('concept', {
    title: 'TCP/IP',
    slug: 'tcp',
    descriptionMarkdown: 'Learn about TCP (Transmission Control Protocol)',
  });

  const networkingProtocolsConcept = server.create('concept', {
    title: 'Networking Protocols',
    slug: 'network-protocols',
    descriptionMarkdown: 'Learn about the various networking protocols and how they differ.',
    blocks: [
      {
        type: 'markdown',
        args: {
          markdown: `Networking protocols are sets of rules used by devices to communicate with each other across a network. They determine things like how data is sent, received, and responded to.

Some examples of networking protocols are:

- HTTP, used for web browsing
- FTP, used for transferring files
- SMTP, used for sending emails`,
        },
      },
      {
        type: 'concept_animation',
        args: {
          concept_animation_slug: 'network-protocols/dummy',
        },
      },
      {
        type: 'click_to_continue',
        args: { button_text: 'Continue' },
      },
      {
        type: 'concept_question',
        args: { concept_question_slug: 'not-a-networking-protocol' },
      },
      {
        type: 'markdown',
        args: {
          markdown: `Next Block`,
        },
      },
      {
        type: 'click_to_continue',
        args: { button_text: 'What else?' },
      },
      {
        type: 'markdown',
        args: {
          markdown: `Another Block`,
        },
      },
      {
        type: 'click_to_continue',
        args: { button_text: 'What else?' },
      },
    ],
  });

  server.create('concept-question', {
    concept: networkingProtocolsConcept,
    slug: 'not-a-networking-protocol',
    queryMarkdown: 'Which of the following is NOT a networking protocol?',
    options: [
      {
        markdown: 'SMTP (Simple Mail Transfer Protocol)',
        is_correct: false,
        explanation_markdown: `
SMTP is incorrect because it is a networking protocol specifically used for sending emails between servers and users, which falls under the category of communication protocols.

The correct answer is GIF because it's not a networking protocol, but rather a file format used for images, not managing or facilitating network communication.
`,
      },
      {
        markdown: 'TCP (Transmission Control Protocol)',
        is_correct: false,
        explanation_markdown: `
TCP (Transmission Control Protocol) is incorrect because it is indeed a networking protocol that establishes reliable connections and data exchange between devices.

GIF (Graphics Interchange Format) is the correct answer because it is an image file format, not a networking protocol that controls communication between devices.
`,
      },
      {
        markdown: 'DNS (Domain Name System)',
        is_correct: false,
        explanation_markdown: `
DNS (Domain Name System) is wrong because it is indeed a networking protocol. It translates human-readable domain names into IP addresses, enabling communication between devices.

GIF (Graphics Interchange Format) is the correct answer because it is not a networking protocol, but rather a file format used for images and graphics.
`,
      },
      {
        markdown: 'GIF (Graphics Interchange Format) A long option that spans two lines',
        is_correct: true,
        explanation_markdown: 'Correct! GIF is a file format, not a networking protocol.',
      },
    ],
  });
}

module('Acceptance | concepts-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can view concepts', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();
    assert.strictEqual(1, 1);

    await conceptsPage.clickOnConceptCard('Networking Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].selectOption('DNS (Domain Name System)');
    await conceptPage.questionCards[0].clickOnSubmitButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
  });

  test('tracks concepts events', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    signInAsStaff(this.owner, this.server);

    await conceptsPage.visit();

    await conceptsPage.clickOnConceptCard('Networking Protocols');
    await conceptPage.clickOnContinueButton();
    await conceptPage.questionCards[0].selectOption('DNS (Domain Name System)');
    await conceptPage.questionCards[0].clickOnSubmitButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();
    await conceptPage.clickOnContinueButton();

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');

    assert.strictEqual(filteredAnalyticsEvents.length, 7, 'Expected 7 analytics events to be tracked');

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
      ],
    );
  });
});
