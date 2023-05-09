import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import percySnapshot from '@percy/ember';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'codecrafters-frontend/tests/support/animation-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscriber, signInAsTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-leaderboard', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can view leaderboard when no recent players are present', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    let currentUser = this.server.schema.users.first();

    assert.strictEqual(coursePage.leaderboard.entries.length, 0, 'no leaderboard entries should be present by default');

    await coursePage.setupItem.clickOnLanguageButton('Python');

    assert.strictEqual(coursePage.leaderboard.entries.length, 1, '1 leaderboard entry should be present once course has started');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to current user');
    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle until user pushes submission');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '0 / 7', 'progress text must be shown');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmission: this.server.create('submission', { repository, status: 'evaluating' }) });

    await this.clock.tick(2001); // Wait for poll
    await finishRender();

    await this.clock.tick(2001); // Wait for transition
    await finishRender();

    this.server.schema.submissions.find(1).update({ status: 'failed' });

    await this.clock.tick(2001);
    await finishRender();

    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle once submission is done evaluating');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '0 / 7', 'progress text must still be 0 if first stage is not completed');

    repository.update({ lastSubmission: this.server.create('submission', { repository, status: 'evaluating' }) });

    await this.clock.tick(2001);
    await finishRender();

    assert.ok(coursePage.leaderboard.entries[0].statusIsActive, 'leaderboard entry should be active if new submission is present evaluating');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '0 / 7', 'progress text must still be 0 if first stage is not completed');

    this.server.schema.submissions.find(2).update({ status: 'success' });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: repository.course.stages.models.find((x) => x.position === 1),
    });

    await this.clock.tick(2001); // Poll
    await finishRender();

    await this.clock.tick(2001); // Transition
    await finishRender();

    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle after completing a stage');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 7', 'progress text must still be 0 if first stage is not completed');
  });

  test('can view leaderboard on overview page when other recent players are present', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let otherUser = this.server.create('user', {
      id: 'other-user',
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'Gufran',
      username: 'Gufran',
    });

    this.server.create('leaderboard-entry', {
      status: 'idle',
      currentCourseStage: redis.stages.models.find((x) => x.position === 2),
      language: python,
      user: otherUser,
      lastAttemptAt: new Date(),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.leaderboard.entries.length, 1, 'other entry should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 7', 'progress text must be shown');

    await coursePage.setupItem.clickOnLanguageButton('Python');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, '2 leaderboard entries should be present once course has started');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 7', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, currentUser.username, 'leaderboard entries should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '0 / 7', 'progress text must be shown');

    let repository = this.server.schema.repositories.find(1);
    repository.update({
      lastSubmission: this.server.create('submission', {
        repository,
        status: 'evaluating',
        createdAt: new Date(),
      }),
    });

    await this.clock.tick(2001); // Wait for poll
    await finishRender();

    await this.clock.tick(2001); // Wait for transition
    await finishRender();

    this.server.schema.submissions.find(1).update({ status: 'success' });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: repository.course.stages.models.find((x) => x.position === 1),
      completedAt: new Date(),
    });

    await this.clock.tick(2001); // Wait for poll
    await finishRender();

    await this.clock.tick(2001); // Wait for transition
    await finishRender();

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, '2 leaderboard entries should be present once other user has been passed');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 7', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, otherUser.username, 'leaderboard entries should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 7', 'progress text must be shown');
  });

  test('can view leaderboard when current user has leaderboard entry', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let otherUser = this.server.create('user', {
      id: 'other-user',
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'Gufran',
      username: 'Gufran',
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
      createdAt: new Date(2002),
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: otherUser,
      createdAt: new Date(2003),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 7', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 7', 'progress text must be shown');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 7', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 7', 'progress text must be shown');
  });

  test('can view leaderboard when current user has completed all stages', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let grep = this.server.schema.courses.findBy({ slug: 'grep' });

    let otherUser = this.server.create('user', {
      id: 'other-user',
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'Gufran',
      username: 'Gufran',
    });

    this.server.create('repository', 'withAllStagesCompleted', {
      course: grep,
      language: python,
      user: currentUser,
      createdAt: new Date(2002),
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: grep,
      language: python,
      user: otherUser,
      createdAt: new Date(2003),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own grep');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '12 / 12', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 12', 'progress text must be shown');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '12 / 12', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 12', 'progress text must be shown');
  });

  test('team member can view leaderboard when no recent players in organization are present', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let otherUser = this.server.create('user', {
      id: 'other-user',
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'Gufran',
      username: 'Gufran',
    });

    this.server.create('leaderboard-entry', {
      status: 'idle',
      currentCourseStage: redis.stages.models.find((x) => x.position === 2),
      language: python,
      user: otherUser,
      lastAttemptAt: new Date(),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.leaderboard.entries.length, 0, 'no leaderboard entries should be present by default');

    await percySnapshot('Leaderboard for teams - Team has no submissions');

    await coursePage.leaderboard.teamDropdown.toggle();
    assert.strictEqual(coursePage.leaderboard.teamDropdown.links.length, 2);
    assert.ok(coursePage.leaderboard.teamDropdown.hasLink('Everyone'), 'should have link for everyone');

    await coursePage.leaderboard.teamDropdown.clickOnLink('Everyone');
    assert.strictEqual(coursePage.leaderboard.entries.length, 1, 'leaderboard entries should be visible if filtering by world');

    await percySnapshot('Leaderboard for teams - Viewing World');
  });

  test('private leaderboard feature suggestion is shown to non-team members with a prompt', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    this.server.create('feature-suggestion', { user: user, featureSlug: 'private-leaderboard' });

    signIn(this.owner, this.server, user);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should have feature suggestion');
    await percySnapshot('Feature Suggestion - Private Leaderboard');

    await coursePage.privateLeaderboardFeatureSuggestion.clickOnDismissButton();
    assert.notOk(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should not have feature suggestion');
  });

  test('private leaderboard feature suggestion is not shown to team members', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    this.server.create('feature-suggestion', { user: user, featureSlug: 'private-leaderboard' });

    signInAsTeamMember(this.owner, this.server, user);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.notOk(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should have feature suggestion');
  });

  test('private leaderboard feature suggestion is not shown to users who do not have a prompt', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    assert.strictEqual(user.featureSuggestions.length, 0);

    signIn(this.owner, this.server, user);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.notOk(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should have feature suggestion');
  });
});
