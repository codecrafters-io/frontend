import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscribedTeamMember, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL } from '@ember/test-helpers';

module('Acceptance | course-page | view-course-stage-solutions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can switch between solution diffs & explanations + switch languages', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Solutions', 'active header tab link should be solutions');

    await coursePage.courseStageSolutionModal.clickOnHeaderTabLink('Verified Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Verified Solution', 'active tab should be Verified Solution');

    await percySnapshot('Stage Solution Modal - Verified Solution');

    assert.strictEqual(coursePage.courseStageSolutionModal.languageDropdown.currentLanguageName, 'Go', 'Go is selected by default');
    assert.notOk(coursePage.courseStageSolutionModal.requestedLanguageNotAvailableNotice.isVisible, 'language notice should not be visible');

    await coursePage.courseStageSolutionModal.languageDropdown.toggle();
    await coursePage.courseStageSolutionModal.languageDropdown.clickOnLink('Python');

    assert.ok(coursePage.courseStageSolutionModal.requestedLanguageNotAvailableNotice.isVisible, 'language notice should be visible');

    assert.strictEqual(
      coursePage.courseStageSolutionModal.requestedLanguageNotAvailableNotice.text,
      "This stage doesn't have verified solutions available for Python yet, so we're showing solutions for Go instead."
    );
  });

  test('can view solutions before starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    await coursePage.courseStageSolutionModal.clickOnCloseButton();

    await coursePage.clickOnCollapsedItem('Bind to a port');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #1: Bind to a port');
    await coursePage.courseStageSolutionModal.clickOnCloseButton();
  });

  test('can view solutions for previous stages after completing them', async function (assert) {
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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Implement the ECHO command');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING');

    await coursePage.courseStageSolutionModal.clickOnCloseButton();
    assert.notOk(coursePage.courseStageSolutionModal.isOpen, 'modal should be closed');

    await coursePage.clickOnCollapsedItem('Respond to multiple PINGs');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #3: Respond to multiple PINGs');

    await coursePage.courseStageSolutionModal.clickOnCloseButton();
    assert.notOk(coursePage.courseStageSolutionModal.isOpen, 'modal should be closed');
  });

  test('viewing solution should not lead to /pay if user is a subscriber', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      name: 'Go',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    await coursePage.collapsedItems[3].click(); // The previous completed stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #3: Respond to multiple PINGs');

    assert.strictEqual(currentURL(), '/courses/redis', 'route should be course route');

    await coursePage.collapsedItems[4].click(); // The next pending stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should not be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #5: Implement the ECHO command');
  });

  test('viewing solution should not lead to /pay if user team has a subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscribedTeamMember(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      name: 'Go',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    await coursePage.collapsedItems[3].click(); // The previous completed stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #3: Respond to multiple PINGs');

    assert.strictEqual(currentURL(), '/courses/redis', 'route should be course route');

    await coursePage.collapsedItems[4].click(); // The next pending stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should not be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #5: Implement the ECHO command');
  });
});
