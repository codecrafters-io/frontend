import percySnapshot from '@percy/ember';
import quizPage from 'codecrafters-frontend/tests/pages/course-admin/quiz-page';
import quizzesPage from 'codecrafters-frontend/tests/pages/course-admin/quizzes-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { competitionQuizAttributes } from 'codecrafters-frontend/mirage/data/competition-quiz-fixtures';
import { currentURL, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsCourseAuthor, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | review-competition-quizzes-test', function (hooks) {
  setupApplicationTest(hooks);

  function createQuiz(server, overrides = {}) {
    return server.create('competition-quiz', { ...competitionQuizAttributes, ...overrides });
  }

  test('staff see the quizzes submitted for a challenge', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);
    createQuiz(this.server, { participantUsername: 'ada', endedAt: new Date('2026-10-11T10:00:00Z') });
    createQuiz(this.server, { participantUsername: 'grace', reviewDecision: 'eligible', reviewedBy: 'paul' });

    await quizzesPage.visit({ course_slug: 'redis' });

    assert.strictEqual(quizzesPage.quizListItems.length, 2, 'newest first');
    assert.strictEqual(quizzesPage.quizListItems[0].usernameText, 'ada');
    assert.contains(quizzesPage.quizListItems[0].competitionText, 'Redis Sprint');
    assert.contains(quizzesPage.quizListItems[0].aiReadText, 'Looks genuine');
    assert.strictEqual(quizzesPage.quizListItems[0].decisionText, 'Undecided');
    assert.strictEqual(quizzesPage.quizListItems[1].decisionText, 'Eligible');

    await percySnapshot('Admin - Competition Quizzes');
  });

  test('the list can hide quizzes that already have a decision', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);
    createQuiz(this.server, { participantUsername: 'ada' });
    createQuiz(this.server, { participantUsername: 'grace', reviewDecision: 'not_eligible', reviewedBy: 'paul' });

    await quizzesPage.visit({ course_slug: 'redis' });
    await quizzesPage.clickOnUndecidedOnlyToggle();

    assert.strictEqual(quizzesPage.quizListItems.length, 1);
    assert.strictEqual(quizzesPage.quizListItems[0].usernameText, 'ada');
  });

  test('the quizzes tab is only shown to staff', async function (assert) {
    testScenario(this.server);

    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await quizzesPage.visit({ course_slug: 'redis' });

    assert.notOk(currentURL().includes('/quizzes'), 'course authors without staff access are sent elsewhere');
    assert.notOk(quizzesPage.quizzesTabIsVisible, 'course authors without staff access do not see the tab');
  });

  test("staff can review a quiz against the participant's code and submissions", async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const quiz = createQuiz(this.server, { participantUsername: 'ada' });

    await quizzesPage.visit({ course_slug: 'redis' });
    await quizzesPage.quizListItems[0].clickOnReviewButton();

    assert.strictEqual(currentURL(), `/courses/redis/admin/quizzes/${quiz.id}`);
    assert.contains(quizPage.summaryText, 'They explained the PING stage');
    assert.strictEqual(quizPage.questions.length, 2);
    assert.contains(quizPage.questions[0].stageText, 'Respond to PING');
    assert.contains(quizPage.questions[0].verdictText, 'Explained it');
    assert.contains(quizPage.questions[0].quoteText, 'loops on recv');
    assert.contains(quizPage.questions[0].submissionsLinkHref, 'usernames=ada');
    assert.contains(quizPage.questions[0].submissionsLinkHref, 'course_stage_slugs=rg2');
    assert.contains(quizPage.questions[1].verdictText, 'Not answered', 'planned questions the participant never answered are listed');
    assert.strictEqual(quizPage.closingAnswers.length, 1);
    assert.contains(quizPage.closingAnswers[0].summaryText, 'Enjoyed the challenge');
    assert.contains(quizPage.closingAnswers[0].quoteText, 'persistence next please');
    assert.strictEqual(quizPage.transcriptTurns.length, 4);

    await percySnapshot('Admin - Competition Quiz');
  });

  test('staff can record who is eligible, with a note', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const quiz = createQuiz(this.server, { participantUsername: 'ada' });

    await quizPage.visit({ course_slug: 'redis', quiz_id: quiz.id });
    await quizPage.fillInReviewNote('Explained the parser clearly.');
    await quizPage.clickOnNotEligibleButton();

    assert.contains(quizPage.decisionText, 'Not eligible');

    quiz.reload();
    assert.strictEqual(quiz.reviewDecision, 'not_eligible');
    assert.strictEqual(quiz.reviewNote, 'Explained the parser clearly.');

    await quizPage.clickOnEligibleButton();

    assert.contains(quizPage.decisionText, 'Eligible');
    assert.strictEqual(quiz.reload().reviewDecision, 'eligible');
  });

  test('a quiz that failed to score still shows its transcript', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const quiz = createQuiz(this.server, {
      errorMessage: "We couldn't score this interview.",
      report: null,
      status: 'failed',
    });

    await quizPage.visit({ course_slug: 'redis', quiz_id: quiz.id });

    assert.ok(quizPage.scoringFailedNoticeIsVisible, 'explains there is no AI write-up');
    assert.strictEqual(quizPage.transcriptTurns.length, 4, 'transcript is still there to review');
  });

  test('staff can play the recording', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const quiz = createQuiz(this.server);

    await quizPage.visit({ course_slug: 'redis', quiz_id: quiz.id });
    await quizPage.clickOnLoadRecordingButton();
    await settled();

    assert.ok(quizPage.recordingPlayerIsVisible, 'audio player is shown');
  });
});
