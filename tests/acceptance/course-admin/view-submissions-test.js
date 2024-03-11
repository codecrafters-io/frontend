import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsCourseAuthor, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import submissionsPage from 'codecrafters-frontend/tests/pages/course-admin/submissions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | course-admin | view-submissions', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders when no submissions are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await submissionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 0);

    await percySnapshot('Admin - Course Submissions - No Submissions');
  });

  test('it renders when submissions are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await submissionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 3);

    await percySnapshot('Admin - Course Submissions - With Submissions');
  });

  test('it renders the user proficiency level if proficiency is set', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      languageProficiencyLevel: 'beginner',
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await submissionsPage.visit({ course_slug: 'redis' });
    assert.true(submissionsPage.submissionDetails.text.includes('Beginner'), true);

    await submissionsPage.submissionDetails.userProficiencyInfoIcon.hover();

    assertTooltipContent(assert, {
      contentString: 'The user selected this value when creating their repository. Options: Never tried, Beginner, Intermediate, Advanced.',
    });
  });

  test('it renders the user proficiency level if proficiency is not set', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await submissionsPage.visit({ course_slug: 'redis' });
    assert.true(submissionsPage.submissionDetails.text.includes('Unknown'), true);

    await submissionsPage.submissionDetails.userProficiencyInfoIcon.hover();

    assertTooltipContent(assert, {
      contentString:
        'The user did not select their proficiency level when creating their repository. Options: Never tried, Beginner, Intermediate, Advanced.',
    });
  });

  test('it does not render the tester version if the user is not staff', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await submissionsPage.visit({ course_slug: 'redis' });

    assert.false(submissionsPage.submissionDetails.text.includes('Tester version'));
  });

  test('it renders the correct tester version tag name if the tester version exists', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    let testerVersion = this.server.create('course-tester-version', {
      course: redis,
      tagName: 'v1',
    });

    repository.submissions.models.forEach((submission) => submission.update({ testerVersion }));

    await submissionsPage.visit({ course_slug: 'redis' });

    assert.true(submissionsPage.submissionDetails.testerVersion.text.includes('v1'));
  });

  test('it renders unknown for the tester version tag name if the tester version does not exist', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await submissionsPage.visit({ course_slug: 'redis' });

    assert.true(submissionsPage.submissionDetails.testerVersion.text.includes('Unknown'));
  });

  test('it filters by username(s) if given', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });
    let user3 = this.server.create('user', { username: 'user3' });

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user1 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user2 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user3 });

    await submissionsPage.visit({ course_slug: 'redis', usernames: 'user1,user2' });
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 4); // 2 users, 2 submissions each
  });

  test('it filters by languages(s) if given', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });
    let user3 = this.server.create('user', { username: 'user3' });

    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let ruby = this.server.schema.languages.findBy({ slug: 'ruby' });
    let javascript = this.server.schema.languages.findBy({ slug: 'javascript' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user1 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: ruby, user: user2 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: javascript, user: user3 });

    await submissionsPage.visit({ course_slug: 'redis', languages: 'python,ruby' });
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 4); // 2 users, 2 submissions each
  });

  test('it should be able to filter by language(s) through a dropdown menu', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });
    let user3 = this.server.create('user', { username: 'user3' });

    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let ruby = this.server.schema.languages.findBy({ slug: 'ruby' });
    let javascript = this.server.schema.languages.findBy({ slug: 'javascript' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: python, user: user1 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: ruby, user: user2 });
    this.server.create('repository', 'withFirstStageInProgress', { course: redis, language: javascript, user: user3 });

    await submissionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 6); // 3 users, 2 submissions each
    assert.strictEqual(submissionsPage.languageDropdown.currentLanguageName, 'All Languages');

    await submissionsPage.languageDropdown.click();
    await submissionsPage.languageDropdown.clickOnLanguageLink('Python');
    assert.strictEqual(submissionsPage.languageDropdown.currentLanguageName, 'Python');
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 2); // 1 user, 2 submissions

    await submissionsPage.languageDropdown.click();
    await submissionsPage.languageDropdown.clickOnLanguageLink('All Languages');
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 6); // 3 users, 2 submissions each
    assert.strictEqual(submissionsPage.languageDropdown.currentLanguageName, 'All Languages');
  });

  test('it filters by stage(s) if given', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });

    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let ruby = this.server.schema.languages.findBy({ slug: 'ruby' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let stage1 = redis.stages.models.sortBy('position')[0].slug;
    let stage2 = redis.stages.models.sortBy('position')[1].slug;

    this.server.create('repository', 'withBaseStagesCompleted', { course: redis, language: python, user: user1 });
    this.server.create('repository', 'withBaseStagesCompleted', { course: redis, language: ruby, user: user2 });

    await submissionsPage.visit({ course_slug: 'redis', course_stage_slugs: stage1 + ',' + stage2 });
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 4); // 2 users, 2 stages each
  });

  test('it should be able to filter by stage(s) through a dropdown menu', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let user1 = this.server.create('user', { username: 'user1' });
    let user2 = this.server.create('user', { username: 'user2' });

    let python = this.server.schema.languages.findBy({ slug: 'python' });
    let ruby = this.server.schema.languages.findBy({ slug: 'ruby' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let stage1 = redis.stages.models.sortBy('position')[0].name;

    this.server.create('repository', 'withBaseStagesCompleted', { course: redis, language: python, user: user1 });
    this.server.create('repository', 'withBaseStagesCompleted', { course: redis, language: ruby, user: user2 });

    await submissionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 14); // 2 users, 7 stages each
    assert.strictEqual(submissionsPage.stageDropdown.currentStageName, 'All Stages');

    await submissionsPage.stageDropdown.click();
    await submissionsPage.stageDropdown.clickOnStageLink(stage1);
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 2); // 2 user, 1 stages each
    assert.strictEqual(submissionsPage.stageDropdown.currentStageName, stage1);

    await submissionsPage.stageDropdown.click();
    await submissionsPage.stageDropdown.clickOnStageLink('All Stages');
    assert.strictEqual(submissionsPage.timelineContainer.entries.length, 14); // 2 users, 7 stages each
    assert.strictEqual(submissionsPage.stageDropdown.currentStageName, 'All Stages');
  });

  test('it should not be accessible if user is course author and did not author current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await submissionsPage.visit({ course_slug: 'git' });
    assert.strictEqual(currentURL(), '/catalog', 'should redirect to catalog page');
  });

  test('it should be accessible if user is course author and authored current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await submissionsPage.visit({ course_slug: 'redis' });
    assert.strictEqual(currentURL(), '/courses/redis/admin/submissions', 'route should be accessible');
  });

  test('it should have the commit SHA in the header', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      commitSha: 'a77c9d85161984249205b5b83772b63ae866e1f4',
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await submissionsPage.visit({ course_slug: 'redis' });

    assert.ok(submissionsPage.submissionDetails.commitSha.isPresent, 'commit sha should be present');

    await submissionsPage.timelineContainer.entries[1].click();

    assert.true(submissionsPage.submissionDetails.commitSha.text.includes('a77c9d85'), 'commit sha is displayed');
    assert.false(submissionsPage.submissionDetails.commitSha.text.includes('a77c9d851'), 'commit sha should be truncated')

    await submissionsPage.submissionDetails.commitSha.copyButton.hover();

    assertTooltipContent(assert, {
      contentString: 'Click to copy Git commit SHA',
    });
  })
});
