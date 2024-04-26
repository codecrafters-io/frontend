import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { add, sub } from 'date-fns';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import {
  signIn,
  signInAsCourseAuthor,
  signInAsSubscriber,
  signInAsSubscribedTeamMember,
} from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, waitFor, waitUntil, find, isSettled, settled, visit } from '@ember/test-helpers';

module('Acceptance | course-page | view-course-stages-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view stages before starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis/introduction', 'introduction page is shown by default');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'stage 2 is shown');

    await coursePage.sidebar.clickOnStepListItem('Bind to a port');
    assert.strictEqual(currentURL(), '/courses/redis/stages/1', 'stage 1 is shown');

    await coursePage.sidebar.clickOnStepListItem('Repository Setup');
    assert.strictEqual(currentURL(), '/courses/redis/setup', 'setup page is shown');
  });

  test('can view previous stages after completing them', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
      completedAt: new Date(new Date().getTime() - 5 * 86400000), // 5 days ago
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
      completedAt: new Date(new Date().getTime() - (1 + 86400000)), // yesterday
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[3],
      completedAt: new Date(new Date().getTime() - 10000), // today
    });

    this.server.create('course-stage-feedback-submission', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[3],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Implement the ECHO command');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING', 'course stage item is active if clicked on');
    assert.contains(coursePage.completedStepNotice.text, 'You completed this stage 5 days ago.');

    await percySnapshot('Course Stages - Completed stage');

    await coursePage.sidebar.clickOnStepListItem('Respond to multiple PINGs');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to multiple PINGs', 'course stage item is active if clicked on');
    assert.contains(coursePage.completedStepNotice.text, 'You completed this stage yesterday.');

    await coursePage.sidebar.clickOnStepListItem('Handle concurrent clients');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Handle concurrent clients', 'course stage item is active if clicked on');
    assert.contains(coursePage.completedStepNotice.text, 'You completed this stage today.');
  });

  test('can navigate directly to stage even if previous stages are not completed', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/courses/redis/stages/2');
    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'stage 2 is shown');
  });

  test('trying to view an invalid stage number redirects to active step', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/courses/redis/stages/100');
    assert.strictEqual(currentURL(), '/courses/redis/introduction', 'introduction page is shown by default');
  });

  test('stages should have an upgrade prompt if they are paid', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.ok(coursePage.upgradePrompt.isVisible, 'course stage item that is not free should have upgrade prompt');

    await percySnapshot('Course Stages - Upgrade Prompt on Active Stage');

    await coursePage.sidebar.clickOnStepListItem('Handle exit codes').click(); // The previous completed stage
    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is completed should not have upgrade prompt');

    await coursePage.sidebar.clickOnStepListItem('Process isolation').click(); // The next pending stage
    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is pending should not have upgrade prompt');
  });

  test('upgrade prompt should have the correct copy when the user is eligible for both early bird and regional discounts', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    currentUser.update('createdAt', new Date(new Date().getTime() - 23 * 60 * 60 * 1000));

    this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.contains(
      coursePage.upgradePrompt.secondaryCopy,
      'Plans start at $40/mo $20/mo (discounted price for India). Save an additional 40% by joining within 60 minutes.',
    );
  });

  test('upgrade prompt should have the correct copy when the user is eligible for an early bird discount', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    currentUser.update('createdAt', new Date(new Date().getTime() - 23 * 60 * 60 * 1000));

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.contains(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $40/mo. Save 40% by joining within 60 minutes.');
  });

  test('upgrade prompt should have the correct copy when the user is eligible for a regional discount', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.contains(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $40/mo $20/mo (discounted price for India).');
  });

  test('upgrade prompt should have the correct copy when there are no discounts', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.contains(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $40/mo.');
  });

  test('stages should not have an upgrade prompt if user is a subscriber', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');
  });

  test('stages should not have an upgrade prompt if user team has a subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscribedTeamMember(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let team = this.server.schema.teams.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.schema.teamSubscriptions.create({
      team: team,
    });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');
  });

  test('stages should not have an upgrade prompt if user has active free usage grants', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 7 }) });

    signIn(this.owner, this.server, user);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.notOk(
      coursePage.hasUpgradePrompt,
      'course stage item that is not free should not have upgrade prompt if user has active free usage grants',
    );
  });

  test('stages should have an upgrade prompt if user has expired free usage grants', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: false, lastFreeUsageGrantExpiresAt: sub(new Date(), { days: 7 }) });

    signIn(this.owner, this.server, user);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user,
    });

    [2, 3].forEach((stageNumber) => {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: docker.stages.models.sortBy('position').toArray()[stageNumber - 1],
      });
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Docker');

    assert.ok(
      coursePage.upgradePrompt.isVisible,
      'course stage item that is not free should have upgrade prompt if user has expired free usage grants',
    );

    await coursePage.sidebar.clickOnStepListItem('Handle exit codes').click(); // The previous completed stage

    assert.notOk(
      coursePage.hasUpgradePrompt,
      'course stage item that is completed should not have upgrade prompt if user has expired free usage grants',
    );

    await coursePage.sidebar.clickOnStepListItem('Process isolation').click(); // The next pending stage

    assert.notOk(
      coursePage.hasUpgradePrompt,
      'course stage item that is pending should not have upgrade prompt if user has expired free usage grants',
    );
  });

  test('first time visit has loading page', async function (assert) {
    this.server.timing = 25; // Ensure requests take long enough for us to observe the loading state

    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    coursePage.visit({ course_slug: 'redis' });
    await waitFor('[data-test-loading]');

    assert.ok(find('[data-test-loading]'), 'loader should be present');
    await settled();
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING');
  });

  test('transition from courses page has no loading page', async function (assert) {
    this.server.timing = 25; // Ensure requests take long enough for us to observe the loading state

    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    let loadingIndicatorWasRendered = false;

    await catalogPage.visit();
    catalogPage.clickOnCourse('Build your own Redis');

    await waitUntil(() => {
      if (isSettled()) {
        return true;
      } else if (find('[data-test-loading]')) {
        loadingIndicatorWasRendered = true;
      }
    });

    assert.notOk(loadingIndicatorWasRendered, 'expected loading indicator to not be rendered');
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING');
  });

  test('it should have a working expand/collapse sidebar button', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.hasExpandedSidebar, 'sidebar should be expanded by default');
    await coursePage.clickOnCollapseSidebarButton();
    assert.notOk(coursePage.hasExpandedSidebar, 'sidebar should be collapsed');
    await coursePage.clickOnExpandSidebarButton();
    assert.ok(coursePage.hasExpandedSidebar, 'sidebar should be expanded');

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('collapsed_course_page_sidebar'), 'collapsed_course_page_sidebar event should be tracked');
    assert.ok(filteredAnalyticsEventsNames.includes('expanded_course_page_sidebar'), 'expanded_course_page_sidebar event should be tracked');
  });

  test('it should have a working expand/collapse leaderboard button', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.hasExpandedLeaderboard, 'leaderboard should be expanded by default');
    await coursePage.clickOnCollapseLeaderboardButton();
    assert.notOk(coursePage.hasExpandedLeaderboard, 'leaderboard should be collapsed');
    await coursePage.clickOnExpandLeaderboardButton();
    assert.ok(coursePage.hasExpandedLeaderboard, 'leaderboard should be expanded');

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(
      filteredAnalyticsEventsNames.includes('collapsed_course_page_leaderboard'),
      'collapsed_course_page_leaderboard event should be tracked',
    );
    assert.ok(filteredAnalyticsEventsNames.includes('expanded_course_page_leaderboard'), 'expanded_course_page_leaderboard event should be tracked');
  });

  test('it should track when the monthly challenge banner is clicked', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.monthlyChallengeBanner.click();

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('clicked_monthly_challenge_banner'), 'clicked_monthly_challenge_banner event should be tracked');
  });

  test('stage should restrict admin access to user if user is course author and course is not authored by user', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Git');
    await courseOverviewPage.clickOnStartCourse();

    assert.false(coursePage.adminButton.isVisible, 'admin button should not be visible');
  });

  test('stage should not restrict admin access to user if user is course author and course is authored by user', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.adminButton.isVisible, 'admin button should be visible');
  });

  test('beta label renders properly', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.schema.courses.findBy({ slug: 'redis' }).update('releaseStatus', 'beta');

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await percySnapshot('Course Stages - Beta Release Status');

    assert.strictEqual(coursePage.betaLabelText, 'FREE DURING BETA', 'beta label should be present');
  });

  test('free label renders properly', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.owner.register('service:date', FakeDateService);

    let dateService = this.owner.lookup('service:date');
    let now = new Date('2024-01-01').getTime();
    dateService.setNow(now);

    let isFreeExpirationDate = new Date('2024-02-01');
    this.server.schema.courses.findBy({ slug: 'redis' }).update('isFreeUntil', isFreeExpirationDate);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await percySnapshot('Course Stages - Free Status');

    assert.strictEqual(
      coursePage.freeCourseLabel.text,
      'FREE THIS MONTH',
      'free label should be present and have correct copy when expiration is first day of next month',
    );

    isFreeExpirationDate = new Date('2024-01-31');
    this.server.schema.courses.findBy({ slug: 'redis' }).update('isFreeUntil', isFreeExpirationDate);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(
      coursePage.freeCourseLabel.text,
      'FREE THIS MONTH',
      'free label should be present and have correct copy when expiration is last day of this month',
    );

    isFreeExpirationDate = new Date('2024-01-16');
    this.server.schema.courses.findBy({ slug: 'redis' }).update('isFreeUntil', isFreeExpirationDate);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.freeCourseLabel.text, 'FREE', 'free label should have correct copy otherwise');

    await coursePage.freeCourseLabel.hover();

    assertTooltipContent(assert, {
      contentString: 'This challenge is free until 16 January 2024!',
    });
  });

  test('header should have a badge that shows the remaining time in days', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 7 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis/introduction', 'introduction page is shown by default');
    assert.true(coursePage.desktopHeader.freeWeeksLeftButton.text.includes('7 days free'), 'expect badge to show correct duration for days');
  });

  test('header should have a badge that shows the remaining time in days when expiry is a couple months away', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 60 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(
      coursePage.desktopHeader.freeWeeksLeftButton.text.includes('60 days free'),
      'expect badge to show correct duration for days when more than a week/month',
    );
  });

  test('header should have a badge that shows the remaining time in hours', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { hours: 7 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.desktopHeader.freeWeeksLeftButton.text.includes('7 hours free'), 'expect badge to show correct duration for hours');
  });

  test('header should have a badge that shows the remaining time in minutes', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { minutes: 15 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.desktopHeader.freeWeeksLeftButton.text.includes('15 minutes free'), 'expect badge to show correct duration for minutes');
  });

  test('header should have a badge that shows the remaining time in minutes when less than a minute left', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { seconds: 30 }) });
    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(
      coursePage.desktopHeader.freeWeeksLeftButton.text.includes('1 minute free'),
      'expect badge to show correct duration for minutes when less than a minute left',
    );
  });

  test('header should show vip badge if user has active free usage grant', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 7 }) });
    user.update({ isVip: true });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.desktopHeader.vipBadge.isVisible, 'expect vip badge to be visible');
    assert.false(coursePage.desktopHeader.freeWeeksLeftButton.isVisible, 'expect free weeks left badge to be hidden');
  });

  test('header should show subscribe button when not vip and has expired free usage grants', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();

    const referralLink = this.server.create('referral-link', {
      user,
      slug: 'test-slug',
      url: 'https://app.codecrafters.io/r/test-slug',
    });

    const customer = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const referralActivation = this.server.create('referral-activation', {
      customer: customer,
      referrer: user,
      referralLink,
      createdAt: new Date(),
    });

    this.server.create('free-usage-grant', {
      user,
      referralActivation,
      activatesAt: sub(new Date(), { days: 10 }),
      sourceType: 'referred_other_user',
      expiresAt: sub(new Date(), { days: 3 }),
    });

    user.update({ hasActiveFreeUsageGrants: false, lastFreeUsageGrantExpiresAt: sub(new Date(), { days: 3 }) });
    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.true(coursePage.desktopHeader.subscribeButton.isVisible, 'expect subscribe button to be visible');
    assert.false(coursePage.desktopHeader.vipBadge.isVisible, 'expect vip badge to be hidden');
    assert.false(coursePage.desktopHeader.freeWeeksLeftButton.isVisible, 'expect free weeks left badge to be hidden');
  });

  test('free weeks left button redirects to /pay', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.first();
    user.update({ hasActiveFreeUsageGrants: true, lastFreeUsageGrantExpiresAt: add(new Date(), { days: 7 }) });

    signIn(this.owner, this.server, user);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.desktopHeader.freeWeeksLeftButton.click();

    assert.strictEqual(currentURL(), '/pay', 'expect to be redirected to pay page');
  });
});
