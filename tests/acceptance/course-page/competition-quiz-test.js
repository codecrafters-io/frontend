import assertLinksToPrivacyPolicy from 'codecrafters-frontend/tests/support/assert-links-to-privacy-policy';
import config from 'codecrafters-frontend/config/environment';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import courseQuizPage from 'codecrafters-frontend/tests/pages/course-quiz-page';
import FakeVoiceInterviewService from 'codecrafters-frontend/tests/support/fake-voice-interview-service';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { readyQuizAttributes } from 'codecrafters-frontend/mirage/data/challenge-interview-fixtures';
import { currentURL, settled, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { Response } from 'miragejs';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

const DAY_MS = 24 * 60 * 60 * 1000;

module('Acceptance | course-page | competition-quiz-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:voice-interview', FakeVoiceInterviewService);
  });

  function createCompetition(server, overrides = {}) {
    return server.create('partner-competition', {
      id: 'redis-sprint',
      name: 'Redis Sprint',
      partnerName: 'Some YouTuber',
      courseSlugs: ['redis'],
      startsAt: new Date(Date.now() - 7 * DAY_MS),
      endsAt: new Date(Date.now() + 7 * DAY_MS),
      quizClosesAt: new Date(Date.now() + 10 * DAY_MS),
      minCompletedStages: 5,
      ...overrides,
    });
  }

  function createRepository(server, overrides = {}, trait = 'withBaseStagesCompleted') {
    const course = server.schema.courses.where({ slug: 'redis' }).models[0];
    course.update('releaseStatus', 'live');

    return server.create('repository', trait, {
      course,
      language: server.schema.languages.where({ name: 'Python' }).models[0],
      user: server.schema.users.first(),
      ...overrides,
    });
  }

  function baseStagesCount(repository) {
    return repository.course.stages.models.filter((stage) => !stage.primaryExtensionSlug).length;
  }

  function quizServiceRequests(server) {
    return Array.from(server.pretender.handledRequests).filter((request) => request.url.startsWith(config.x.interviewServiceUrl));
  }

  function signInWithQuizAccess(owner, server) {
    const user = signIn(owner, server);
    user.update({ featureFlags: { 'can-view-competition-quiz': true } });

    return user;
  }

  test('participants see the quiz card when a competition is open for the challenge', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);

    const repository = createRepository(this.server);

    await visit('/courses/redis/base-stages-completed');

    assert.ok(coursePage.competitionQuizCard.isVisible, 'competition quiz card is visible');
    assert.contains(coursePage.competitionQuizCard.titleText, 'Redis Sprint');
    assert.notOk(coursePage.interviewPromptCard.isVisible, 'the staff-only practice card stays hidden');

    await coursePage.competitionQuizCard.clickOnTakeQuizButton();

    assert.strictEqual(currentURL(), `/courses/redis/quiz/redis-sprint?repo=${repository.id}`);
    assert.ok(courseQuizPage.competitionLobby.isVisible, 'competition lobby is visible');
    assert.strictEqual(courseQuizPage.competitionLobby.totalStagesText, `${baseStagesCount(repository)} stages`);
    assert.strictEqual(courseQuizPage.competitionLobby.stageGroups.length, 1, 'only base stages were completed');
    assert.strictEqual(courseQuizPage.competitionLobby.stageGroups[0].name, 'Base stages');
  });

  test('the lobby summarises completed stages by extension, with names on demand', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);

    const repository = createRepository(this.server);
    const stagesOf = (extensionSlug) =>
      repository.course.stages.models.filter((stage) => stage.primaryExtensionSlug === extensionSlug).toSorted((a, b) => a.position - b.position);
    const rdbStages = stagesOf('persistence-rdb').slice(0, 3);
    const transactionsStages = stagesOf('transactions').slice(0, 2);

    // Seeded out of course order, so the lobby has to sort groups and stages itself.
    [...transactionsStages, ...rdbStages.toReversed()].forEach((courseStage) => {
      this.server.create('course-stage-completion', { repository, courseStage, completedAt: repository.createdAt });
    });

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    const lobby = courseQuizPage.competitionLobby;

    assert.strictEqual(lobby.totalStagesText, `${baseStagesCount(repository) + rdbStages.length + transactionsStages.length} stages`);
    assert.deepEqual(
      lobby.stageGroups.map((group) => group.name),
      ['Base stages', 'RDB Persistence', 'Transactions'],
      'base stages first, then extensions in course order',
    );

    const rdbGroup = lobby.stageGroups[1];

    assert.strictEqual(rdbGroup.countText, `${rdbStages.length} stages`);
    assert.false(rdbGroup.isExpanded, 'groups start collapsed, hiding stage names');

    await rdbGroup.clickOnSummary();

    assert.true(rdbGroup.isExpanded, 'the group expands');
    assert.deepEqual(
      rdbGroup.stages.map((stage) => stage.text),
      rdbStages.map((stage) => stage.name),
      "the group lists that extension's stages, in order",
    );
    assert.false(lobby.stageGroups[0].isExpanded, 'other groups stay collapsed');
  });

  test('the quiz card and lobby link to the privacy policy on a line of their own', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await visit('/courses/redis/base-stages-completed');

    assertLinksToPrivacyPolicy(assert, coursePage.competitionQuizCard.recordingNotice, 'quiz card');

    await coursePage.competitionQuizCard.clickOnTakeQuizButton();

    assertLinksToPrivacyPolicy(assert, courseQuizPage.competitionLobby.recordingNotice, 'quiz lobby');
  });

  test('the quiz card is hidden when no competition is open for the challenge', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server, { courseSlugs: ['docker'] });
    createRepository(this.server);

    await visit('/courses/redis/base-stages-completed');

    assert.notOk(coursePage.competitionQuizCard.isVisible, 'competition quiz card is hidden');
  });

  test('the quiz card stays hidden for people without quiz access, without asking the quiz service', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await visit('/courses/redis/base-stages-completed');

    assert.notOk(coursePage.competitionQuizCard.isVisible, 'competition quiz card is hidden');
    assert.strictEqual(quizServiceRequests(this.server).length, 0, 'the quiz service is never asked');
  });

  test('staff see the quiz card without quiz access', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await visit('/courses/redis/base-stages-completed');

    assert.ok(coursePage.competitionQuizCard.isVisible, 'competition quiz card is visible');
  });

  test('the quiz page sends people without quiz access back to the challenge, without asking the quiz service', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    assert.notOk(currentURL().includes('/quiz/'), 'redirected away from the quiz page');
    assert.strictEqual(quizServiceRequests(this.server).length, 0, 'the quiz service is never asked');
  });

  test('requests to the quiz service carry the session token and none of the analytics headers', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await visit('/courses/redis/base-stages-completed');

    const [request] = quizServiceRequests(this.server);
    const customHeaders = Object.keys(request.requestHeaders)
      .map((name) => name.toLowerCase())
      .filter((name) => name.startsWith('x-'));

    assert.deepEqual(customHeaders, ['x-session-token']);
  });

  test('participants can take the quiz and see it submitted, without a grade', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);

    const repository = createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    assert.notOk(courseQuizPage.header.isVisible, 'site header is hidden so the quiz fits the screen');
    assert.notOk(courseQuizPage.footer.isVisible, 'site footer is hidden too');
    assert.contains(courseQuizPage.competitionLobby.oneAttemptNoticeText, 'only once');

    await percySnapshot('Course Quiz Page - Lobby');

    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');

    assert.strictEqual(courseQuizPage.topBar.remainingTimeText, '10:00 mins');
    assert.contains(courseQuizPage.topBar.titleText, 'Quiz');
    assert.contains(courseQuizPage.topBar.titleText, 'Redis Sprint');
    assert.strictEqual(voiceInterview.lastSessionOptions.dynamicVariables.competition_name, 'Redis Sprint', 'agent variables come from the server');
    assert.strictEqual(voiceInterview.lastSessionOptions.dynamicVariables.call_minutes, '10');
    assert.strictEqual(courseQuizPage.codePanel.fileTabs.length, 2, 'code stays on screen');
    assert.ok(courseQuizPage.competitionCard.isVisible, 'sidebar names the competition');

    voiceInterview.simulateAgentMessage('How did you implement the PING command?');
    await settled();
    voiceInterview.simulateAgentEndedCall();
    await settled();

    assert.ok(courseQuizPage.submittedScreen.isVisible, 'submitted screen is visible');
    assert.contains(courseQuizPage.submittedScreen.descriptionText, 'Redis Sprint');
    assert.notOk(courseQuizPage.report.isVisible, 'no grade is shown');

    await percySnapshot('Course Quiz Page - Submitted');

    const savedInterview = this.server.schema.challengeInterviews.first();

    assert.strictEqual(savedInterview.format, 'competition');
    assert.strictEqual(savedInterview.competitionSlug, 'redis-sprint');
    assert.strictEqual(savedInterview.repositoryId, repository.id);
    assert.strictEqual(savedInterview.conversationId, 'fake-conversation-id');
  });

  test('a submitted quiz shows as submitted on the card and on the quiz page', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);

    const repository = createRepository(this.server);
    this.server.create('challenge-interview', 'submittedQuiz', { repository });

    await visit('/courses/redis/base-stages-completed');

    assert.ok(coursePage.competitionQuizCard.submittedNoticeIsVisible, 'card says the quiz was submitted');
    assert.notOk(coursePage.competitionQuizCard.takeQuizButton.isVisible, 'no button to take it again');

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    assert.ok(courseQuizPage.submittedScreen.isVisible, 'submitted screen is visible');
    assert.notOk(courseQuizPage.competitionLobby.isVisible, 'lobby is not offered again');
  });

  test('the quiz card stays hidden until enough stages are completed during the competition', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server, { minCompletedStages: 10 });
    createRepository(this.server);

    await visit('/courses/redis/base-stages-completed');

    assert.notOk(coursePage.competitionQuizCard.isVisible, 'no card with fewer stages than the minimum');
  });

  test('a submitted quiz stays on the card even below the minimum', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server, { minCompletedStages: 10 });

    const repository = createRepository(this.server);
    this.server.create('challenge-interview', 'submittedQuiz', { repository });

    await visit('/courses/redis/base-stages-completed');

    assert.ok(coursePage.competitionQuizCard.submittedNoticeIsVisible, 'card says the quiz was submitted');
  });

  test('an unfinished attempt is resumed instead of preparing new questions', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);

    const repository = createRepository(this.server);
    const attempt = this.server.create('challenge-interview', 'readyQuiz', { repository });

    await visit('/courses/redis/base-stages-completed');

    assert.strictEqual(coursePage.competitionQuizCard.takeQuizButton.text, 'Resume quiz');

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');

    assert.strictEqual(this.server.schema.challengeInterviews.all().length, 1, 'no new attempt is created');
    assert.strictEqual(voiceInterview.lastSessionOptions.dynamicVariables.interview_id, attempt.id);
  });

  test('shows the reason when the quiz service refuses, without offering a retry', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    this.server.post(
      `${config.x.interviewServiceUrl}/api/challenge-interviews`,
      () => new Response(409, {}, { error: "You've already taken the quiz for Redis Sprint." }),
    );

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    assert.ok(courseQuizPage.failedScreen.isVisible, 'failed screen is visible');
    assert.strictEqual(courseQuizPage.failedScreen.descriptionText, "You've already taken the quiz for Redis Sprint.");
    assert.notOk(courseQuizPage.failedScreen.tryAgainButton.isVisible, 'retrying would be refused again');
    assert.ok(courseQuizPage.failedScreen.backToChallengeButton.isVisible, 'offers a way back');
  });

  test('a call that never connects lets the participant try again', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    this.owner.lookup('service:voice-interview').simulateAgentEndedCall();
    await settled();

    assert.contains(courseQuizPage.failedScreen.descriptionText, 'never connected');

    await courseQuizPage.failedScreen.clickOnTryAgainButton();

    assert.ok(courseQuizPage.competitionLobby.isVisible, 'lobby is visible again');
  });

  test('the call is attached the moment the interviewer joins, so the quiz counts even if the tab closes', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');
    const connectedRequests = () => quizServiceRequests(this.server).filter((request) => request.url.endsWith('/connected'));

    assert.strictEqual(connectedRequests().length, 0, 'nothing is attached before the interviewer speaks');

    voiceInterview.simulateAgentMessage('How did you implement the PING command?');
    await settled();

    assert.deepEqual(JSON.parse(connectedRequests()[0].requestBody), { conversation_id: 'fake-conversation-id' });
    assert.strictEqual(this.server.schema.challengeInterviews.first().conversationId, 'fake-conversation-id');
  });

  test('a call that fails to connect sets its questions aside, and trying again prepares a fresh attempt', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    const voiceInterview = this.owner.lookup('service:voice-interview');
    voiceInterview.nextConnectionError = 'Could not establish a WebRTC connection';

    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    assert.ok(courseQuizPage.failedScreen.isVisible, 'the failure is shown');

    const [endRequest] = quizServiceRequests(this.server).filter((request) => request.url.endsWith('/ended'));

    assert.deepEqual(
      JSON.parse(endRequest.requestBody),
      { conversation_id: null, end_reason: 'connection_error' },
      'the server hears it never connected',
    );

    voiceInterview.nextConnectionError = null;
    await courseQuizPage.failedScreen.clickOnTryAgainButton();
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    assert.strictEqual(this.server.schema.challengeInterviews.all().length, 2, 'a fresh attempt was prepared');
    assert.ok(voiceInterview.isConnecting, 'the new call is starting');
  });

  test('trying again after the quiz service hiccups picks the same attempt back up', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    let lookups = 0;

    this.server.get(`${config.x.interviewServiceUrl}/api/challenge-interviews/:id`, function (schema, request) {
      const interview = schema.challengeInterviews.find(request.params.id);
      lookups += 1;

      if (lookups === 1) {
        return new Response(502, {}, { error: "Couldn't reach the voice service" });
      }

      interview.update({ ...readyQuizAttributes, agentVariables: { ...readyQuizAttributes.agentVariables, interview_id: interview.id } });

      return interview;
    });

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    assert.ok(courseQuizPage.failedScreen.isVisible, 'the hiccup is shown');

    await courseQuizPage.failedScreen.clickOnTryAgainButton();
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    assert.strictEqual(this.server.schema.challengeInterviews.all().length, 1, 'the same attempt was picked back up');
    assert.ok(this.owner.lookup('service:voice-interview').isConnecting, 'the call starts');
  });

  test('starting picks up an attempt that was already prepared, and fetches its call', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    this.server.post(`${config.x.interviewServiceUrl}/api/challenge-interviews`, function (schema) {
      const attrs = this.normalizedRequestAttrs('challenge-interview');

      return schema.challengeInterviews.create({
        ...attrs,
        ...readyQuizAttributes,
        agentVariables: null,
        conversationToken: null,
        createdAt: new Date(),
        format: 'competition',
        isSubmitted: false,
      });
    });

    this.server.get(`${config.x.interviewServiceUrl}/api/challenge-interviews/:id`, function (schema, request) {
      const interview = schema.challengeInterviews.find(request.params.id);
      interview.update({ ...readyQuizAttributes, agentVariables: { ...readyQuizAttributes.agentVariables, interview_id: interview.id } });

      return interview;
    });

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    assert.ok(this.owner.lookup('service:voice-interview').isConnecting, 'the call starts');
  });

  test('muting while the call connects carries over once it does', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    const voiceInterview = this.owner.lookup('service:voice-interview');
    const releaseConnection = voiceInterview.holdNextConnection();

    await courseQuizPage.competitionLobby.clickOnStartQuizButton();
    await courseQuizPage.callControls.clickOnMuteButton();
    releaseConnection();
    await settled();

    assert.deepEqual(voiceInterview.mutedStates, [true], 'the microphone is muted on the call itself');
  });

  test('leaving during the quiz asks first, since it ends the call', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    const confirmations = [];
    const answers = [false, true];

    window.confirm = (message) => {
      confirmations.push(message);

      return answers.shift();
    };

    await courseQuizPage.topBar.clickOnLogoLink();

    assert.ok(currentURL().includes('/quiz/'), 'still on the quiz');
    assert.ok(this.owner.lookup('service:voice-interview').isConnecting, 'staying keeps the call going');
    assert.contains(confirmations[0], 'uses up this attempt');

    const unload = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(unload);

    assert.true(unload.defaultPrevented, 'closing the tab asks too');

    await courseQuizPage.topBar.clickOnLogoLink();

    assert.notOk(currentURL().includes('/quiz/'), 'left after confirming');
    assert.strictEqual(confirmations.length, 2, 'asked once per attempt to leave');
  });

  test('a quiz whose call was attached shows as submitted even if saving its end fails', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    this.server.post(
      `${config.x.interviewServiceUrl}/api/challenge-interviews/:id/ended`,
      () => new Response(500, {}, { error: 'Something went wrong on our side' }),
    );

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');
    voiceInterview.simulateAgentMessage('How did you implement the PING command?');
    await settled();
    voiceInterview.simulateAgentEndedCall();
    await settled();

    assert.ok(courseQuizPage.submittedScreen.isVisible, 'the attached call already counts');
  });

  test('if saving the end of an unattached call fails, trying again sends it again instead of starting over', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server);

    let endRequests = 0;

    this.server.post(
      `${config.x.interviewServiceUrl}/api/challenge-interviews/:id/connected`,
      () => new Response(500, {}, { error: 'Something went wrong on our side' }),
    );

    this.server.post(`${config.x.interviewServiceUrl}/api/challenge-interviews/:id/ended`, function (schema, request) {
      endRequests += 1;

      if (endRequests === 1) {
        return new Response(500, {}, { error: 'Something went wrong on our side' });
      }

      const interview = schema.challengeInterviews.find(request.params.id);
      interview.update({ conversationId: 'fake-conversation-id', conversationToken: null, isSubmitted: true, status: 'scoring' });

      return interview;
    });

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });
    await courseQuizPage.competitionLobby.clickOnStartQuizButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');
    voiceInterview.simulateAgentMessage('How did you implement the PING command?');
    await settled();
    voiceInterview.simulateAgentEndedCall();
    await settled();

    assert.ok(courseQuizPage.failedScreen.isVisible, "the participant hears it didn't save");

    await courseQuizPage.failedScreen.clickOnTryAgainButton();

    assert.ok(courseQuizPage.submittedScreen.isVisible, 'the resent end saves the quiz');
    assert.strictEqual(endRequests, 2);
    assert.strictEqual(this.server.schema.challengeInterviews.all().length, 1, 'no second attempt was started');
  });

  test('the lobby says how many more stages are needed before the quiz', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server, { minCompletedStages: 10 });
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    const lobby = courseQuizPage.competitionLobby;

    assert.contains(lobby.moreStagesNeededNoticeText, "You've completed 7 of the 10 stages you need during Redis Sprint.");
    assert.contains(lobby.moreStagesNeededNoticeText, 'Complete 3 more, then come back for the quiz.');
    assert.strictEqual(lobby.stageGroups.length, 1, 'still shows the stages that count');
    assert.ok(lobby.startQuizButtonIsDisabled, 'start is disabled');
  });

  test('the lobby asks for the minimum when no stages count yet', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server);
    createRepository(this.server, { createdAt: new Date(Date.now() - 30 * DAY_MS) });

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    const lobby = courseQuizPage.competitionLobby;

    assert.contains(
      lobby.moreStagesNeededNoticeText,
      'Complete at least 5 stages of Build your own Redis during Redis Sprint, then come back for the quiz.',
    );
    assert.ok(lobby.startQuizButtonIsDisabled, 'start is disabled');
  });

  test('the lobby lets you start once you have the minimum', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createCompetition(this.server, { minCompletedStages: 7 });
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'redis-sprint' });

    assert.notOk(courseQuizPage.competitionLobby.moreStagesNeededNoticeIsVisible, 'nothing more to do');
    assert.notOk(courseQuizPage.competitionLobby.startQuizButtonIsDisabled, 'start is enabled');
  });

  test('the quiz page sends you back to the challenge for a competition that is not open', async function (assert) {
    testScenario(this.server);
    signInWithQuizAccess(this.owner, this.server);
    createRepository(this.server);

    await courseQuizPage.visit({ course_slug: 'redis', competition_slug: 'made-up' });

    assert.notOk(currentURL().includes('/quiz/'), 'redirected away from the quiz page');
  });
});
