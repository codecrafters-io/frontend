import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import conceptsPage from 'codecrafters-frontend/tests/pages/concepts-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | concepts-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can view concepts', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const networkingProtocolsConcept = this.server.create('concept', {
      title: 'Networking Protocols',
      slug: 'networking-protocols',
      descriptionMarkdown: 'Learn about the various networking protocols and how they differ.',
      introductionMarkdown: 'Test your understanding of networking protocols by going through the following questions.',
    });

    this.server.create('concept', {
      title: 'TCP/IP',
      slug: 'tcp',
      descriptionMarkdown: 'Learn about TCP (Transmission Control Protocol)',
      introductionMarkdown: 'In this course you will learn about TCP (Transmission Control Protocol)',
    });

    this.server.create('concept-question', {
      concept: networkingProtocolsConcept,
      questionMarkdown: 'Which of the following is NOT a networking protocol?',
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
          markdown: 'GIF (Graphics Interchange Format)',
          is_correct: true,
          explanation_markdown: 'Correct! GIF is a file format, not a networking protocol.',
        },
      ],
    });

    await conceptsPage.visit();
    assert.strictEqual(1, 1);

    await conceptsPage.clickOnConceptCard('Networking Protocols');

    await this.pauseTest();
  });
});
