import assertLinksToPrivacyPolicy from 'codecrafters-frontend/tests/support/assert-links-to-privacy-policy';
import config from 'codecrafters-frontend/config/environment';
import courseInterviewPage from 'codecrafters-frontend/tests/pages/course-interview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import { currentURL, settled, visit, waitUntil } from '@ember/test-helpers';
import FakeVoiceInterviewService from 'codecrafters-frontend/tests/support/fake-voice-interview-service';
import { module, test } from 'qunit';
import percySnapshot from '@percy/ember';
import { Response } from 'miragejs';
import { scoredInterviewReport } from 'codecrafters-frontend/mirage/data/challenge-interview-fixtures';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | ai-interview-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:voice-interview', FakeVoiceInterviewService);
  });

  function createRepository(server, courseSlug, trait) {
    const course = server.schema.courses.where({ slug: courseSlug }).models[0];
    course.update('releaseStatus', 'live');

    return server.create('repository', trait, {
      course,
      language: server.schema.languages.where({ name: 'Python' }).models[0],
      user: server.schema.users.first(),
    });
  }

  test('staff users see the interview prompt on the base stages completed page', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await visit('/courses/redis/base-stages-completed');

    assert.ok(coursePage.interviewPromptCard.isVisible, 'interview prompt card is visible');
    assert.strictEqual(coursePage.interviewPromptCard.startInterviewButtonText, 'Start interview');
    assert.notOk(coursePage.interviewPromptCard.viewReportButton.isVisible, 'view report button is hidden without a scored interview');

    await coursePage.interviewPromptCard.clickOnStartInterviewButton();

    assert.strictEqual(currentURL(), `/courses/redis/interview/base-stages?repo=${repository.id}`);
    assert.ok(courseInterviewPage.lobby.isVisible, 'lobby is visible');
  });

  test('the interview card and lobby link to the privacy policy on a line of their own', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);
    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await visit('/courses/redis/base-stages-completed');

    assertLinksToPrivacyPolicy(assert, coursePage.interviewPromptCard.recordingNotice, 'interview card');

    await coursePage.interviewPromptCard.clickOnStartInterviewButton();

    assertLinksToPrivacyPolicy(assert, courseInterviewPage.lobby.recordingNotice, 'interview lobby');
  });

  test('non-staff users do not see the interview prompt', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await visit('/courses/redis/base-stages-completed');

    assert.strictEqual(currentURL(), '/courses/redis/base-stages-completed');
    assert.notOk(coursePage.interviewPromptCard.isVisible, 'interview prompt card is hidden');
  });

  test('non-staff users are redirected away from the interview page', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });

    assert.notOk(currentURL().includes('/interview/'), 'redirected away from the interview page');
    assert.notOk(courseInterviewPage.lobby.isVisible, 'lobby is not rendered');
  });

  test('extension completed page offers an interview about that extension', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'dummy', 'withBaseStagesCompleted');

    repository.course.stages.models
      .filter((stage) => stage.primaryExtensionSlug === 'ext1')
      .forEach((stage) => this.server.create('submission', 'withStageCompletion', { repository, courseStage: stage }));

    await visit('/courses/dummy/extension-completed/ext1');

    assert.ok(coursePage.interviewPromptCard.isVisible, 'interview prompt card is visible');
    assert.contains(coursePage.interviewPromptCard.startInterviewButtonHref, `/courses/dummy/interview/ext1?repo=${repository.id}`);

    await coursePage.interviewPromptCard.clickOnStartInterviewButton();

    assert.strictEqual(courseInterviewPage.lobby.stagesCovered.length, 2, 'lobby lists the extension stages');
  });

  test('course completed page offers an interview about the last extension', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'grep', 'withAllStagesCompleted');

    await visit('/courses/grep/completed');

    assert.ok(coursePage.interviewPromptCard.isVisible, 'interview prompt card is visible');
    assert.contains(coursePage.interviewPromptCard.startInterviewButtonHref, `/courses/grep/interview/backreferences?repo=${repository.id}`);
  });

  test('course completed page offers a base stages interview for challenges without extensions', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'docker', 'withAllStagesCompleted');

    await visit('/courses/docker/completed');

    assert.ok(coursePage.interviewPromptCard.isVisible, 'interview prompt card is visible');
    assert.contains(coursePage.interviewPromptCard.startInterviewButtonHref, `/courses/docker/interview/base-stages?repo=${repository.id}`);
  });

  test('prompt shows the latest result and links to its report', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'redis', 'withBaseStagesCompleted');
    const interview = this.server.create('challenge-interview', 'scored', { repository });

    await visit('/courses/redis/base-stages-completed');

    assert.contains(coursePage.interviewPromptCard.latestResultText, 'Mixed understanding');
    assert.strictEqual(coursePage.interviewPromptCard.startInterviewButtonText, 'Retake interview');

    await coursePage.interviewPromptCard.clickOnViewReportButton();

    assert.strictEqual(currentURL(), `/courses/redis/interview/base-stages?interview=${interview.id}&repo=${repository.id}`);
    assert.ok(courseInterviewPage.report.isVisible, 'report is visible');
    assert.contains(courseInterviewPage.report.summaryText, 'Solid grasp of the connection lifecycle');
  });

  test('staff users can complete an interview about their code', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'redis', 'withBaseStagesCompleted');
    const baseStagesCount = repository.course.stages.models.filter((stage) => !stage.primaryExtensionSlug).length;

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });

    assert.notOk(courseInterviewPage.header.isVisible, 'site header is hidden so the interview fits the screen');
    assert.notOk(courseInterviewPage.footer.isVisible, 'site footer is hidden too');
    assert.strictEqual(courseInterviewPage.lobby.stagesCovered.length, baseStagesCount, 'lobby lists every base stage');
    assert.notOk(courseInterviewPage.topBar.endInterviewButtonIsVisible, 'end interview button is hidden before the call');

    await percySnapshot('Course Interview Page - Lobby');

    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');

    assert.ok(courseInterviewPage.topBar.endInterviewButtonIsVisible, 'end interview button is visible during the call');
    assert.strictEqual(courseInterviewPage.topBar.remainingTimeText, '8:00 mins');
    assert.strictEqual(courseInterviewPage.codePanel.fileTabs.length, 2, 'code panel shows a tab per file');
    assert.strictEqual(voiceInterview.lastSessionOptions.conversationToken, 'fake-conversation-token');
    assert.deepEqual(voiceInterview.lastSessionOptions.availableFilePaths, ['app/main.py', 'app/resp.py']);
    assert.strictEqual(voiceInterview.lastSessionOptions.dynamicVariables.milestone_title, 'Base stages');
    assert.contains(voiceInterview.lastSessionOptions.dynamicVariables.interview_brief, 'Walk me through what happens when a client sends PING.');
    assert.strictEqual(voiceInterview.lastSessionOptions.dynamicVariables.call_minutes, '8', 'the interviewer promises the time on the countdown');
    assert.strictEqual(courseInterviewPage.voiceOrb.statusText, 'Connecting', 'the call is not live until the interviewer speaks');

    voiceInterview.simulateAgentMessage('Walk me through what happens when a client sends PING.');
    await settled();

    assert.strictEqual(courseInterviewPage.captionsPanel.latestCaptionText, 'Walk me through what happens when a client sends PING.');

    const showCodeResult = voiceInterview.simulateShowCode({ file_path: 'main.py', start_line: 5, end_line: 12 });
    await settled();

    assert.contains(showCodeResult, 'Showing app/main.py');
    assert.contains(courseInterviewPage.codePanel.codeHighlightLabelText, 'app/main.py, lines 5–12');
    assert.strictEqual(courseInterviewPage.codePanel.highlightedLines.length, 8, 'highlights the lines the interviewer asked about');
    assert.ok(courseInterviewPage.codePanel.fileTabs[0].hasHighlightedFileIndicator, 'highlighted file tab is marked');

    const missingFileResult = voiceInterview.simulateShowCode({ file_path: 'app/missing.py', start_line: 1, end_line: 2 });
    assert.contains(missingFileResult, 'No file at "app/missing.py"');

    await percySnapshot('Course Interview Page - Live');

    voiceInterview.simulateUserMessage('Each client gets its own thread.');
    await settled();

    assert.strictEqual(courseInterviewPage.captionsPanel.latestCaptionText, 'Each client gets its own thread.');
    assert.strictEqual(courseInterviewPage.captionsPanel.previousCaptionText, 'Walk me through what happens when a client sends PING.');
    assert.ok(courseInterviewPage.captionsPanel.listeningIndicatorIsVisible, 'listening indicator is visible while the user speaks');

    await courseInterviewPage.callControls.clickOnMuteButton();

    assert.strictEqual(courseInterviewPage.callControls.muteButtonText, 'Unmute');
    assert.deepEqual(voiceInterview.mutedStates, [true]);

    await courseInterviewPage.callControls.clickOnCaptionsToggleButton();

    assert.notOk(courseInterviewPage.captionsPanel.latestCaptionIsVisible, 'captions are hidden');
    assert.notOk(courseInterviewPage.captionsPanel.listeningIndicatorIsVisible, 'listening indicator is hidden with the captions');
    assert.strictEqual(courseInterviewPage.voiceOrb.statusText, 'Your turn to speak', 'the voice orb still shows whose turn it is');
    assert.strictEqual(courseInterviewPage.callControls.captionsToggleButtonText, 'Show captions');

    await courseInterviewPage.callControls.clickOnCaptionsToggleButton();

    assert.strictEqual(courseInterviewPage.captionsPanel.latestCaptionText, 'Each client gets its own thread.', 'captions come back where they were');

    await courseInterviewPage.callControls.clickOnCaptionsToggleButton();

    voiceInterview.simulateAgentEndedCall();
    await settled();

    assert.ok(courseInterviewPage.report.isVisible, 'report is visible');
    assert.contains(courseInterviewPage.report.overallVerdictText, 'Mixed');
    assert.strictEqual(
      courseInterviewPage.report.questionsDemonstratedText,
      '1 of 3 questions demonstrated',
      'counts against every planned question',
    );
    assert.strictEqual(courseInterviewPage.report.questions.length, 2);
    assert.contains(courseInterviewPage.report.questions[1].verdictText, 'Not demonstrated');
    assert.contains(courseInterviewPage.report.questions[1].evidenceQuoteText, 'I think recv always gives you the full command?');
    assert.strictEqual(courseInterviewPage.report.questions[0].codeExcerptLines.length, 12, 'excerpt shows the anchor with surrounding lines');

    await percySnapshot('Course Interview Page - Report');

    const savedInterview = this.server.schema.challengeInterviews.first();

    assert.strictEqual(savedInterview.repositoryId, repository.id);
    assert.strictEqual(savedInterview.milestoneSlug, 'base-stages');
    assert.strictEqual(savedInterview.conversationId, 'fake-conversation-id');
    assert.strictEqual(savedInterview.endReason, 'agent_ended');
    assert.strictEqual(savedInterview.status, 'scored');
  });

  test('ending the interview early still produces a report', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    this.owner.lookup('service:voice-interview').simulateAgentMessage('Walk me through your event loop.');
    await courseInterviewPage.topBar.clickOnEndInterviewButton();

    assert.ok(courseInterviewPage.report.isVisible, 'report is visible');
    assert.strictEqual(this.server.schema.challengeInterviews.first().endReason, 'user_ended');
  });

  test('a call the interviewer hangs up before speaking fails instead of being scored', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    this.owner.lookup('service:voice-interview').simulateAgentEndedCall();
    await settled();

    assert.ok(courseInterviewPage.failedScreen.isVisible, 'failed screen is visible');
    assert.contains(courseInterviewPage.failedScreen.descriptionText, 'never connected');

    const savedInterview = this.server.schema.challengeInterviews.first();

    assert.strictEqual(savedInterview.conversationId, null, 'the empty call is not sent for scoring');
    assert.strictEqual(savedInterview.endReason, 'connection_error');
  });

  test('the call gives up when the interviewer never speaks', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    const voiceInterview = this.owner.lookup('service:voice-interview');
    voiceInterview.interviewerJoinTimeoutMs = 0;

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();
    await waitUntil(() => courseInterviewPage.failedScreen.isVisible);
    await settled();

    assert.contains(courseInterviewPage.failedScreen.descriptionText, 'never connected');
    assert.strictEqual(this.server.schema.challengeInterviews.first().endReason, 'connection_error');

    await courseInterviewPage.failedScreen.clickOnTryAgainButton();

    assert.ok(courseInterviewPage.lobby.isVisible, 'lobby is visible again');
  });

  test('turning captions off in the lobby hides them during the call', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnCaptionsCheckbox();
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    this.owner.lookup('service:voice-interview').simulateAgentMessage('Walk me through your event loop.');
    await settled();

    assert.notOk(courseInterviewPage.captionsPanel.latestCaptionIsVisible, 'caption text is not rendered');
    assert.strictEqual(courseInterviewPage.voiceOrb.statusText, 'Interviewer is speaking');
  });

  test('captions only show the words the interviewer has spoken so far', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');

    voiceInterview.simulateAgentSpeech('Walk me through your event loop.', 60000);
    await settled();

    assert.strictEqual(courseInterviewPage.captionsPanel.latestCaptionText, 'Walk', 'words that have not been spoken yet are not shown');
    assert.strictEqual(courseInterviewPage.voiceOrb.statusText, 'Interviewer is speaking');
  });

  test('a pause mid-sentence does not end the interviewer turn', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');

    voiceInterview.simulateAgentSpeech('Walk me through your event loop.', 60000);
    voiceInterview.simulateModeChange('listening');
    await settled();

    assert.strictEqual(courseInterviewPage.captionsPanel.latestCaptionText, 'Walk', 'the rest of the sentence is not revealed early');
    assert.notOk(courseInterviewPage.captionsPanel.listeningIndicatorIsVisible, 'listening indicator stays hidden');
    assert.strictEqual(courseInterviewPage.voiceOrb.statusText, 'Interviewer is speaking');
  });

  test('interrupting the interviewer cuts the caption off where they stopped', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    const voiceInterview = this.owner.lookup('service:voice-interview');

    voiceInterview.simulateAgentSpeech('Walk me through your event loop.', 60000);
    voiceInterview.simulateInterruption();
    await settled();

    assert.strictEqual(courseInterviewPage.captionsPanel.latestCaptionText, 'Walk', 'only the words spoken before the interruption remain');
    assert.ok(courseInterviewPage.captionsPanel.listeningIndicatorIsVisible, 'the turn passes to the candidate straight away');

    voiceInterview.simulateUserMessage('Sorry, can you repeat that?');
    await settled();

    assert.strictEqual(courseInterviewPage.captionsPanel.latestCaptionText, 'Sorry, can you repeat that?');
    assert.strictEqual(courseInterviewPage.captionsPanel.previousCaptionText, 'Walk');
  });

  test('shows a notice when microphone access is blocked', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    const voiceInterview = this.owner.lookup('service:voice-interview');

    voiceInterview.checkMicrophone = async () => {
      voiceInterview.microphoneStatus = 'blocked';

      return false;
    };

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    assert.ok(courseInterviewPage.lobby.microphoneBlockedNoticeIsVisible, 'microphone blocked notice is visible');
    assert.strictEqual(this.server.schema.challengeInterviews.all().length, 0, 'no interview is created');
  });

  test('shows an error and lets the user retry when the interview service fails', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createRepository(this.server, 'redis', 'withBaseStagesCompleted');

    this.server.post(`${config.x.interviewServiceUrl}/api/challenge-interviews`, () => new Response(500, {}, { errors: [{ detail: 'Boom' }] }));

    await courseInterviewPage.visit({ course_slug: 'redis', milestone_slug: 'base-stages' });
    await courseInterviewPage.lobby.clickOnStartInterviewButton();

    assert.ok(courseInterviewPage.failedScreen.isVisible, 'failed screen is visible');
    assert.contains(courseInterviewPage.failedScreen.descriptionText, "We couldn't reach the interview service");

    await courseInterviewPage.failedScreen.clickOnTryAgainButton();

    assert.ok(courseInterviewPage.lobby.isVisible, 'lobby is visible again');
  });

  test('can retake an interview from its report', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'redis', 'withBaseStagesCompleted');
    const interview = this.server.create('challenge-interview', 'scored', { repository });

    await visit(`/courses/redis/interview/base-stages?interview=${interview.id}&repo=${repository.id}`);

    assert.ok(courseInterviewPage.report.isVisible, 'report is visible');

    await courseInterviewPage.report.clickOnRetakeButton();

    assert.strictEqual(currentURL(), `/courses/redis/interview/base-stages?repo=${repository.id}`);
    assert.ok(courseInterviewPage.lobby.isVisible, 'lobby is visible');
  });

  test('a report scored before planned questions were counted shows the questions it has', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const repository = createRepository(this.server, 'redis', 'withBaseStagesCompleted');
    const report = { ...scoredInterviewReport, planned_question_count: undefined };
    const interview = this.server.create('challenge-interview', 'scored', { report, repository });

    await visit(`/courses/redis/interview/base-stages?interview=${interview.id}&repo=${repository.id}`);

    assert.strictEqual(courseInterviewPage.report.questionsDemonstratedText, '1 of 2 questions demonstrated');
  });
});
