import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import enableCourseStageChat from 'codecrafters-frontend/tests/support/enable-course-stage-chat';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { Response } from 'miragejs';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | course-stage-chat', function (hooks) {
  setupApplicationTest(hooks);

  async function visitActiveRedisStage(context) {
    testScenario(context.server);
    const currentUser = signInAsSubscriber(context.owner, context.server);
    const go = context.server.schema.languages.findBy({ slug: 'go' });
    const redis = context.server.schema.courses.findBy({ slug: 'redis' });

    context.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
  }

  async function expandChat() {
    await coursePage.courseStageChatPanel.clickOnToggle();
  }

  test('hides the panel when the experiment returns 404', async function (assert) {
    await visitActiveRedisStage(this);

    assert.notOk(coursePage.courseStageChatPanel.isVisible);
  });

  test('hides the panel when the experiment returns 400', async function (assert) {
    this.server.get('/experiments/course-stage-chats', () => new Response(400, {}, { error: 'experiment_disabled' }));
    await visitActiveRedisStage(this);

    assert.notOk(coursePage.courseStageChatPanel.isVisible);
  });

  test('is collapsed by default and can be toggled when the experiment is on', async function (assert) {
    enableCourseStageChat(this.server);
    await visitActiveRedisStage(this);

    assert.ok(coursePage.courseStageChatPanel.isVisible);
    assert.strictEqual(coursePage.courseStageChatPanel.title, 'Ask about this stage');
    assert.strictEqual(coursePage.courseStageChatPanel.betaLabelText, 'Beta');
    assert.notOk(coursePage.courseStageChatPanel.isExpanded);

    await expandChat();

    assert.ok(coursePage.courseStageChatPanel.isExpanded);
    assert.strictEqual(coursePage.courseStageChatPanel.messages.length, 0);

    await coursePage.courseStageChatPanel.clickOnToggle();

    assert.notOk(coursePage.courseStageChatPanel.isExpanded);
  });

  test('sends a message and shows that turn’s assistant reply after polling', async function (assert) {
    enableCourseStageChat(this.server);
    await visitActiveRedisStage(this);
    await expandChat();

    await coursePage.courseStageChatPanel.fillInBody('How does PING work?');
    await coursePage.courseStageChatPanel.clickOnAskButton();

    assert.strictEqual(coursePage.courseStageChatPanel.messages.length, 2);
    assert.strictEqual(coursePage.courseStageChatPanel.messages[0].role, 'user');
    assert.strictEqual(coursePage.courseStageChatPanel.messages[0].body, 'How does PING work?');
    assert.strictEqual(coursePage.courseStageChatPanel.messages[1].role, 'assistant');
    assert.ok(coursePage.courseStageChatPanel.messages[1].body.includes('Here is an answer about this stage.'));
  });

  test('sends a message with cmd+enter', async function (assert) {
    enableCourseStageChat(this.server);
    await visitActiveRedisStage(this);
    await expandChat();

    await coursePage.courseStageChatPanel.fillInBody('How does PING work?');
    await coursePage.courseStageChatPanel.keydownOnInput({ key: 'Enter', metaKey: true });

    assert.strictEqual(coursePage.courseStageChatPanel.messages.length, 2);
    assert.strictEqual(coursePage.courseStageChatPanel.messages[0].body, 'How does PING work?');
    assert.ok(coursePage.courseStageChatPanel.messages[1].body.includes('Here is an answer about this stage.'));
  });

  test('still shows the assistant body when refused is true', async function (assert) {
    enableCourseStageChat(this.server);
    await visitActiveRedisStage(this);
    await expandChat();

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const repository = this.server.schema.repositories.first();
    const pingStage = redis.stages.models.find((stage) => stage.slug === 'rg2');

    const chat = this.server.create('course-stage-chat', {
      courseStage: pingStage,
      repository,
    });

    this.server.create('course-stage-chat-message', {
      body: 'I cannot help with that.',
      chat,
      courseStage: pingStage,
      refused: true,
      repository,
      role: 'assistant',
      status: 'complete',
    });

    await coursePage.sidebar.clickOnStepListItem('Bind to a port');
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');

    assert.ok(coursePage.courseStageChatPanel.isVisible);
    assert.ok(coursePage.courseStageChatPanel.messages[0].body.includes('I cannot help with that.'));
  });

  test('can rate an assistant message', async function (assert) {
    enableCourseStageChat(this.server);
    await visitActiveRedisStage(this);
    await expandChat();

    await coursePage.courseStageChatPanel.fillInBody('How does PING work?');
    await coursePage.courseStageChatPanel.clickOnAskButton();
    await coursePage.courseStageChatPanel.clickOnRatingUp();

    const assistantMessage = this.server.schema.courseStageChatMessages.findBy({ role: 'assistant' });

    assert.strictEqual(assistantMessage.rating, 'up');
  });

  test('loads a different thread when the stage changes', async function (assert) {
    enableCourseStageChat(this.server);
    await visitActiveRedisStage(this);
    await expandChat();

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const repository = this.server.schema.repositories.first();
    const pingStage = redis.stages.models.find((stage) => stage.slug === 'rg2');
    const bindStage = redis.stages.models.find((stage) => stage.slug === 'jm1');

    const pingChat = this.server.create('course-stage-chat', {
      courseStage: pingStage,
      repository,
    });
    this.server.create('course-stage-chat-message', {
      body: 'Ping thread answer',
      chat: pingChat,
      courseStage: pingStage,
      repository,
      role: 'assistant',
      status: 'complete',
    });

    const bindChat = this.server.create('course-stage-chat', {
      courseStage: bindStage,
      repository,
    });
    this.server.create('course-stage-chat-message', {
      body: 'Bind thread answer',
      chat: bindChat,
      courseStage: bindStage,
      repository,
      role: 'assistant',
      status: 'complete',
    });

    await coursePage.sidebar.clickOnStepListItem('Bind to a port');
    assert.ok(coursePage.courseStageChatPanel.messages[0].body.includes('Bind thread answer'));

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    assert.ok(coursePage.courseStageChatPanel.messages[0].body.includes('Ping thread answer'));
  });
});
