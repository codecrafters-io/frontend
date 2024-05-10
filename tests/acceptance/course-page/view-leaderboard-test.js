import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent, assertTooltipNotRendered } from 'ember-tooltips/test-support';
import { currentURL, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber, signInAsTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-leaderboard', function(hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view leaderboard when no recent players are present', async function(assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    let currentUser = this.server.schema.users.first();

    assert.strictEqual(coursePage.leaderboard.entries.length, 0, 'no leaderboard entries should be present by default');

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');

    assert.strictEqual(coursePage.leaderboard.entries.length, 1, '1 leaderboard entry should be present once course has started');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to current user');
    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle until user pushes submission');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '0 / 31', 'progress text must be shown');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmission: this.server.create('submission', { repository, status: 'evaluating' }) });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await settled();

    this.server.schema.submissions.find(1).update({ status: 'failed' });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await settled();

    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle once submission is done evaluating');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '0 / 31', 'progress text must still be 0 if first stage is not completed');

    repository.update({ lastSubmission: this.server.create('submission', { repository, status: 'evaluating' }) });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await settled();

    assert.ok(coursePage.leaderboard.entries[0].statusIsActive, 'leaderboard entry should be active if new submission is present evaluating');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '0 / 31', 'progress text must still be 0 if first stage is not completed');

    this.server.schema.submissions.find(2).update({ status: 'success' });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: repository.course.stages.models.find((x) => x.position === 1),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await settled();

    assert.ok(coursePage.leaderboard.entries[0].statusIsIdle, 'leaderboard entry should be idle after completing a stage');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 31', 'progress text must still be 0 if first stage is not completed');
  });

  test('can view leaderboard on overview page when other recent players are present', async function(assert) {
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
      user: otherUser,
      createdAt: new Date(2003),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.leaderboard.entries.length, 1, 'other entry should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 31', 'progress text must be shown');

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, '2 leaderboard entries should be present once course has started');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 31', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, currentUser.username, 'leaderboard entries should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '0 / 31', 'progress text must be shown');

    let repository = currentUser.reload().repositories.models[0];
    repository.update({
      lastSubmission: this.server.create('submission', {
        repository,
        status: 'evaluating',
        createdAt: new Date(),
      }),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    await new Promise((resolve) => setTimeout(resolve, 101)); // Wait for transition
    await finishRender();

    repository.lastSubmission.update({ status: 'success' })

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: repository.course.stages.models.find((x) => x.position === 1),
      completedAt: new Date(),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    await new Promise((resolve) => setTimeout(resolve, 101)); // Wait for transition
    await finishRender();

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, '2 leaderboard entries should be present once other user has been passed');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 31', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, otherUser.username, 'leaderboard entries should be sorted by last attempt');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 31', 'progress text must be shown');
  });

  test('can view leaderboard when current user has leaderboard entry', async function(assert) {
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

    let userRepo = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
      createdAt: new Date(2002, 1),
    });

    let otherRepo = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: otherUser,
      createdAt: new Date(2003, 1),
    });


    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 31', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 31', 'progress text must be shown');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '1 / 31', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 31', 'progress text must be shown');
  });

  test('can view leaderboard when current user has completed all stages', async function(assert) {
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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own grep');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '15 / 15', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 15', 'progress text must be shown');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '15 / 15', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 15', 'progress text must be shown');
  });

  test('team member can view leaderboard when no recent players in organization are present', async function(assert) {
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

    this.server.create('course-leaderboard-entry', {
      status: 'idle',
      currentCourseStage: redis.stages.models.find((x) => x.position === 2),
      language: python,
      user: otherUser,
      lastAttemptAt: new Date(),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.leaderboard.entries.length, 0, 'no leaderboard entries should be present by default');

    await percySnapshot('Leaderboard for teams - Team has no submissions');

    await coursePage.leaderboard.teamDropdown.toggle();
    assert.strictEqual(coursePage.leaderboard.teamDropdown.links.length, 2);
    assert.ok(coursePage.leaderboard.teamDropdown.hasLink('Everyone'), 'should have link for everyone');

    await coursePage.leaderboard.teamDropdown.clickOnLink('Everyone');
    assert.strictEqual(coursePage.leaderboard.entries.length, 1, 'leaderboard entries should be visible if filtering by world');

    await percySnapshot('Leaderboard for teams - Viewing World');
  });

  test('private leaderboard feature suggestion is shown to non-team members with a prompt', async function(assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    this.server.create('feature-suggestion', { user: user, featureSlug: 'private-leaderboard' });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should have feature suggestion');
    await percySnapshot('Feature Suggestion - Private Leaderboard');

    await coursePage.privateLeaderboardFeatureSuggestion.clickOnDismissButton();
    assert.notOk(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should not have feature suggestion');
  });

  test('private leaderboard feature suggestion is not shown to team members', async function(assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    this.server.create('feature-suggestion', { user: user, featureSlug: 'private-leaderboard' });

    signInAsTeamMember(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.notOk(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should have feature suggestion');
  });

  test('private leaderboard feature suggestion is not shown to users who do not have a prompt', async function(assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    assert.strictEqual(user.featureSuggestions.length, 0);

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.notOk(coursePage.privateLeaderboardFeatureSuggestion.isPresent, 'should have feature suggestion');
  });

  test('invite button redirects to the teams page on team leaderboard', async function(assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.leaderboard.inviteButton.isPresent, 'invite button is present');

    await coursePage.leaderboard.inviteButton.click();
    assert.strictEqual(currentURL(), '/teams/dummy-team-id', 'invite button redirects to correct route');

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('clicked_invite_button'), 'clicked_invite_button event should be tracked');
  });

  test('invite button redirects to the refer page on public leaderboard', async function(assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.leaderboard.inviteButton.isPresent, 'invite button is present');

    await coursePage.leaderboard.inviteButton.hover();

    assertTooltipContent(assert, {
      contentString: 'Get 7 days free by inviting a friend',
    });

    await coursePage.leaderboard.inviteButton.click();
    assert.strictEqual(currentURL(), '/refer', 'invite button redirects to correct route');

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('clicked_invite_button'), 'clicked_invite_button event should be tracked');
  });

  test('invite button has no tooltip for user with paid content access', async function(assert) {
    testScenario(this.server);
    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    user.update('isVip', true);
    user.save();
    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.leaderboard.inviteButton.isPresent, 'invite button is present');

    await coursePage.leaderboard.inviteButton.hover();
    assertTooltipNotRendered(assert);
  });

  test('leaderboard reflects the correct progress if stages at a later position are completed first', async function(assert) {
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

    let userRepository = this.server.create('repository', 'withBaseStagesCompleted', {
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

    let replicationFirstStage = this.server.schema.courseStages.findBy({ slug: 'repl-custom-port' });

    this.server.create('submission', 'withStageCompletion', {
      repository: userRepository,
      courseStage: replicationFirstStage,
      createdAt: userRepository.createdAt,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.leaderboard.entries.length, 2, 'one entry for current user and one for other user should be shown');
    assert.strictEqual(coursePage.leaderboard.entries[0].username, currentUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[0].progressText, '8 / 31', 'progress text must be shown');
    assert.strictEqual(coursePage.leaderboard.entries[1].username, otherUser.username, 'leaderboard entry should correspond to name from API');
    assert.strictEqual(coursePage.leaderboard.entries[1].progressText, '1 / 31', 'progress text must be shown');
  });
});
