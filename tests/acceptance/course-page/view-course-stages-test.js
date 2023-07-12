import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscriber, signInAsSubscribedTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, waitFor, waitUntil, find, isSettled, settled } from '@ember/test-helpers';

module('Acceptance | course-page | view-course-stages-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view stages before starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis/setup', 'setup page is shown by default');

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

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #5: Implement the ECHO command');

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING', 'course stage item is active if clicked on');
    assert.strictEqual(coursePage.yourTaskCard.footerText, 'You completed this stage 5 days ago.', 'footer text for stage completed > 1 day');

    await percySnapshot('Course Stages - Completed stage');

    await coursePage.sidebar.clickOnStepListItem('Respond to multiple PINGs');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #3: Respond to multiple PINGs', 'course stage item is active if clicked on');
    assert.strictEqual(coursePage.yourTaskCard.footerText, 'You completed this stage yesterday.', 'footer text for stage completed yesterday');

    await coursePage.sidebar.clickOnStepListItem('Handle concurrent clients');
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #4: Handle concurrent clients', 'course stage item is active if clicked on');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'You completed this stage today.', 'footer text for stage completed today');
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

    assert.ok(coursePage.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');

    await percySnapshot('Course Stages - Upgrade Prompt on Active Stage');

    await coursePage.sidebar.clickOnStepListItem('Handle exit codes').click(); // The previous completed stage
    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is completed should not have upgrade prompt');

    await coursePage.sidebar.clickOnStepListItem('Process isolation').click(); // The next pending stage
    assert.notOk(coursePage.hasUpgradePrompt, 'course stage item that is pending should not have upgrade prompt');
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
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING');
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
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING');
  });
});
