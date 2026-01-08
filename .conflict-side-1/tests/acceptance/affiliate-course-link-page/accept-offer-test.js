import affiliateCourseLinkPage from 'codecrafters-frontend/tests/pages/affiliate-course-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL } from '@ember/test-helpers';
import windowMock from 'ember-window-mock';

module('Acceptance | affiliate-course-link-page | accept-offer', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('accepting offer when not logged in redirects to login', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', {
      slug: 'referral1',
      user: this.server.create('user', { username: 'referrer1', avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4' }),
    });

    await affiliateCourseLinkPage.visit({ via: 'referral1', course_slug: 'grep' });
    assert.strictEqual(currentURL(), '/join/grep?via=referral1');

    await affiliateCourseLinkPage.acceptReferralButtons[0].click();
    assert.strictEqual(
      windowMock.location.href,
      `${windowMock.location.origin}/login?next=http%3A%2F%2Flocalhost%3A${window.location.port}%2Fjoin%2Fgrep%3Fvia%3Dreferral1`,
      'should redirect to login URL',
    );
  });

  test('can accept offer', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const referrer = this.server.create('user', {
      username: 'referrer1',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    });

    this.server.create('affiliate-link', { slug: 'referral1', user: referrer });

    await affiliateCourseLinkPage.visit({ via: 'referral1', course_slug: 'grep' });
    await affiliateCourseLinkPage.acceptReferralButtons[0].click();

    assert.strictEqual(currentURL(), '/courses/grep/introduction');
  });
});
