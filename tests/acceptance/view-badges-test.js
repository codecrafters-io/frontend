import badgesPage from 'codecrafters-frontend/tests/pages/badges-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

function createBadges(server) {
  server.create('badge', {
    name: 'The Turing Badge',
    shortDescription: 'Complete 3 stages within a day',
    slug: 'three-in-a-day',
    descriptionMarkdown: '',
  });
  server.create('badge', { name: 'The Hamilton Badge', shortDescription: 'Complete 5 stages in a week', slug: 'five-in-a-week' });
  server.create('badge', { name: 'The Curie Badge', shortDescription: 'Complete a stage despite a failed attempt', slug: 'persistent' });
  server.create('badge', { name: 'The Tesla Badge', shortDescription: 'Complete a stage on first attempt', slug: 'right-the-first-time' });
  server.create('badge', { name: 'The Hopper Badge', shortDescription: 'Complete a stage in under a minute', slug: 'quick-to-start' });

  server.schema.badges.all().models.forEach((badge) => {
    badge.update({
      descriptionMarkdown: `
**Granted in honor of the Nobel laureate Marie Curie.**

When World War I led to the destruction of her laboratory, Curie didn’t falter. Instead, she set up
mobile radiography units to aid the war effort, continuing her research under challenging circumstances.
      `,
    });
    badge.save();
  });
}

module('Acceptance | view-badges', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders when all badges are unearned', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createBadges(this.server);

    await badgesPage.visit();
    assert.strictEqual(1, 1);
  });

  test('it renders when some badges are earned', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createBadges(this.server);

    const currentUser = this.server.schema.users.first();
    const badge = this.server.schema.badges.findBy({ slug: 'three-in-a-day' });
    badge.currentUserAwards = [this.server.create('badge-award', { user: currentUser, badge: badge, awardedAt: new Date() })];
    badge.save();

    await badgesPage.visit();
    assert.strictEqual(1, 1);

    await badgesPage.clickOnBadge('The Turing Badge');
  });
});
