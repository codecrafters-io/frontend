import percySnapshot from '@percy/ember';
import affiliateCourseLinkPage from 'codecrafters-frontend/tests/pages/affiliate-course-link-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';

module('Acceptance | affiliate-course-link-page | view', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view affiliate link when not logged in', async function (assert) {
    testScenario(this.server);

    this.server.create('affiliate-link', { user: this.server.schema.users.first() });

    await affiliateCourseLinkPage.visit({ via: 'referral1', course_slug: 'grep' });
    assert.strictEqual(1, 1);

    await percySnapshot('Affiliate Course Link Page | View | Anonymous');
  });

  // test('can view affiliate link when logged in', async function (assert) {
  //   testScenario(this.server);
  //   signIn(this.owner, this.server);

  //   this.server.create('affiliate-link', { user: this.server.schema.users.first() });

  //   await affiliateLinkPage.visit({ via: 'referral1' });
  //   assert.ok(affiliateLinkPage.acceptReferralButtons[0].isVisible);
  //   assert.ok(affiliateLinkPage.acceptReferralButtons[1].isVisible);
  //   assert.ok(affiliateLinkPage.acceptReferralButtons[2].isVisible);

  //   await percySnapshot('Affiliate Link Page | View Affiliate Link (anonymous)');
  // });

  // test('redirects to not found if affiliate link is invalid', async function (assert) {
  //   testScenario(this.server);

  //   await affiliateLinkPage.visit({ via: 'invalid' });
  //   assert.strictEqual(currentURL(), '/404');
  // });
});
