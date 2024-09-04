import percySnapshot from '@percy/ember';
import affiliateCourseLinkPage from 'codecrafters-frontend/tests/pages/affiliate-course-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL } from '@ember/test-helpers';

module('Acceptance | affiliate-course-link-page | view', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view affiliate link when not logged in', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', {
      slug: 'referral1',
      user: this.server.create('user', { username: 'referrer1', avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4' }),
    });

    await affiliateCourseLinkPage.visit({ via: 'referral1', course_slug: 'grep' });
    assert.strictEqual(currentURL(), '/join/grep?via=referral1');

    await percySnapshot('Affiliate Course Link Page | View | Anonymous');
  });

  test('can view affiliate link when logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('affiliate-link', {
      slug: 'referral1',
      user: this.server.create('user', { username: 'referrer1', avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4' }),
    });

    await affiliateCourseLinkPage.visit({ via: 'referral1', course_slug: 'grep' });
    assert.strictEqual(currentURL(), '/join/grep?via=referral1');

    await percySnapshot('Affiliate Course Link Page | View | Logged In');
  });

  test('redirects to not found if affiliate link is invalid', async function (assert) {
    testScenario(this.server);

    await affiliateCourseLinkPage.visit({ via: 'invalid', course_slug: 'grep' });
    assert.strictEqual(currentURL(), '/404');
  });

  test('redirects to not found if course slug is invalid', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', {
      slug: 'referral1',
      user: this.server.create('user', { username: 'referrer1', avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4' }),
    });

    await affiliateCourseLinkPage.visit({ via: 'referral1', course_slug: 'invalid' });
    assert.strictEqual(currentURL(), '/404');
  });
});
