/* eslint-disable qunit/require-expect */
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import screencastsPage from 'codecrafters-frontend/tests/pages/screencasts-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import windowMock from 'ember-window-mock';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit } from '@ember/test-helpers';

module('Acceptance | course-page | view-screencasts-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('redirects to login page if user is not signed in', async function (assert) {
    testScenario(this.server);

    assert.expect(2);

    try {
      await visit('/courses/redis/stages/2/screencasts');
    } catch (e) {
      assert.strictEqual(1, 1);
    }

    assert.strictEqual(
      windowMock.location.href,
      `${windowMock.location.origin}/login?next=http%3A%2F%2Flocalhost%3A${window.location.port}%2Fcourses%2Fredis%2Fstages%2F2%2Fscreencasts`,
      'should redirect to login URL',
    );
  });

  test('can view screencasts', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let go = this.server.schema.languages.findBy({ name: 'Go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    function createScreencast(server, language, publishedAt, title, durationInSeconds) {
      return server.create('course-stage-screencast', {
        language: language,
        user: currentUser,
        courseStage: redis.stages.models.sortBy('position')[1],
        authorName: null,
        canonicalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
        publishedAt: publishedAt,
        description: 'Hey there! blah blah',
        durationInSeconds: durationInSeconds,
        embedHtml:
          '\u003cdiv\u003e\u003cdiv style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"\u003e\u003ciframe src="//cdn.iframe.ly/api/iframe?click_to_play=1\u0026url=https%3A%2F%2Fwww.loom.com%2Fshare%2F1dd746eaaba34bc2b5459ad929934c08%3Fsid%3Da5f6ec60-5ae4-4e9c-9566-33235d483431\u0026key=3aafd05f43d700b9a7382620ac7cdfa3" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media *;"\u003e\u003c/iframe\u003e\u003c/div\u003e\u003c/div\u003e',
        sourceIconUrl: 'https://cdn.loom.com/assets/favicons-loom/android-chrome-192x192.png',
        originalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
        thumbnailUrl: 'https://cdn.loom.com/sessions/thumbnails/1dd746eaaba34bc2b5459ad929934c08-00001.gif',
        title: title,
      });
    }

    createScreencast(this.server, python, '2023-06-30T19:11:29.254Z', 'Python screencast', 50);
    createScreencast(this.server, go, '2023-06-30T19:11:29.254Z', 'Go screencast #1', 500); // Older
    createScreencast(this.server, go, '2024-01-30T19:11:29.254Z', 'Go screencast #2', 5000); // Newer

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('View Screencasts');

    assert.strictEqual(screencastsPage.screencastPreviews.length, 3);

    // Active repo is Python, Python screencast should be at the top
    assert.strictEqual(screencastsPage.screencastPreviews[0].titleText, 'Python screencast');
    // Newer screencast between languages should be shown earlier
    assert.strictEqual(screencastsPage.screencastPreviews[1].titleText, 'Go screencast #2');
    assert.strictEqual(screencastsPage.screencastPreviews[2].titleText, 'Go screencast #1');

    assert.strictEqual(screencastsPage.screencastPreviews[0].formattedDurationText, '50 seconds');
    assert.strictEqual(screencastsPage.screencastPreviews[1].formattedDurationText, '1 hour 23 minutes');
    assert.strictEqual(screencastsPage.screencastPreviews[2].formattedDurationText, '8 minutes');

    // TODO: Check that clicking on a screencast shows it as active one

    assert.strictEqual(1, 1);
  });
});
