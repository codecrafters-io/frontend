import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsBetaParticipant, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | view-course-stages-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can view stages before starting course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.ok(coursePage.setupItemIsActive, 'setup item is active by default');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is active if clicked on');

    await coursePage.clickOnCollapsedItem('Bind to a port');
    await animationsSettled();

    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is active if clicked on');

    await coursePage.clickOnCollapsedItem('Setup');
    await animationsSettled();

    assert.ok(coursePage.setupItemIsActive, 'setup item is active if clicked on');
  });

  test('can view previous stages after completing them', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

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
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to multiple PINGs');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING', 'course stage item is active if clicked on');
  });

  test('stages should have an upgrade prompt if free usage quota is exhausted', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let c = this.server.schema.languages.findBy({ name: 'C' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: c,
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

    this.server.create('free-usage-quota', {
      user: currentUser,
      status: 'exhausted',
      resetsAt: new Date(Date.now() + 1000 * 60),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Docker');

    assert.ok(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');
    assert.ok(coursePage.activeCourseStageItem.upgradePrompt.colorIsYellow, 'course stage prompt should be yellow if stage is current');
    assert.equal(coursePage.activeCourseStageItem.statusText, 'SUBSCRIPTION REQUIRED', 'status text should be subscription required');

    await percySnapshot('Course Stages - Upgrade Prompt on Active Stage');

    await coursePage.collapsedItems[3].click(); // The previous completed stage
    await animationsSettled();

    assert.notOk(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item that is completed should not have upgrade prompt');

    await coursePage.collapsedItems[4].click(); // The next pending stage
    await animationsSettled();

    assert.ok(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item that is pending should have upgrade prompt');
    assert.ok(coursePage.activeCourseStageItem.upgradePrompt.colorIsGray, 'course stage prompt should be gray if stage is not current');
    assert.equal(coursePage.activeCourseStageItem.statusText, 'PENDING', 'status text should be pending');

    await percySnapshot('Course Stages - Upgrade Prompt on Pending Stage');
  });

  test('stages should not have an upgrade prompt if the user has a subscription', async function (assert) {
    signInAsSubscriber(this.owner);
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let c = this.server.schema.languages.findBy({ name: 'C' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: c,
      name: 'C #1',
      user: currentUser,
    });

    this.server.create('free-usage-quota', {
      user: currentUser,
      status: 'exhausted',
      resetsAt: new Date(Date.now() + 1000 * 60),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Docker');

    await coursePage.collapsedItems[3].click();
    await animationsSettled();

    assert.notOk(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item should not have upgrade prompt if user is subscriber');
  });

  test('stages should not have an upgrade prompt if challenge is beta', async function (assert) {
    signInAsBetaParticipant(this.owner);
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let c = this.server.schema.languages.findBy({ name: 'C' });
    let sqlite = this.server.schema.courses.findBy({ slug: 'sqlite' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: sqlite,
      language: c,
      name: 'C #1',
      user: currentUser,
    });

    this.server.create('free-usage-quota', {
      user: currentUser,
      status: 'exhausted',
      resetsAt: new Date(Date.now() + 1000 * 60),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own SQLite');

    await coursePage.collapsedItems[3].click();
    assert.notOk(coursePage.activeCourseStageItem.hasUpgradePrompt, 'beta course stage item should not have upgrade prompt');
  });
});
