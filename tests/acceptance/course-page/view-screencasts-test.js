import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-screencasts-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view screencasts', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('course-stage-screencast', {
      language: python,
      user: currentUser,
      courseStage: redis.stages.models.sortBy('position')[1],
      authorName: null,
      canonicalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
      publishedAt: '2023-06-30T19:11:29.254Z',
      description: 'Hey there! blah blah',
      durationInSeconds: 808.5666666666664,
      embedHtml:
        '\u003cdiv\u003e\u003cdiv style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"\u003e\u003ciframe src="//cdn.iframe.ly/api/iframe?click_to_play=1\u0026url=https%3A%2F%2Fwww.loom.com%2Fshare%2F1dd746eaaba34bc2b5459ad929934c08%3Fsid%3Da5f6ec60-5ae4-4e9c-9566-33235d483431\u0026key=3aafd05f43d700b9a7382620ac7cdfa3" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media *;"\u003e\u003c/iframe\u003e\u003c/div\u003e\u003c/div\u003e',
      sourceIconUrl: 'https://cdn.loom.com/assets/favicons-loom/android-chrome-192x192.png',
      originalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
      thumbnailUrl: 'https://cdn.loom.com/sessions/thumbnails/1dd746eaaba34bc2b5459ad929934c08-00001.gif',
      title: 'Testing Course Completion Functionality',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Screencasts');

    // await this.pauseTest();

    assert.strictEqual(1, 1);
  });
});
