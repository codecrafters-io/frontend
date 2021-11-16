import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsBetaParticipant, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | view-courses', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    assert.equal(coursesPage.courseCards.length, 3, 'expected 3 course cards to be present');
  });

  test('it renders early access courses if user is beta participant', async function (assert) {
    signInAsBetaParticipant(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    assert.equal(coursesPage.courseCards.length, 4, 'expected 4 course cards to be present');

    assert.notOk(coursesPage.courseCards[0].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(coursesPage.courseCards[1].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(coursesPage.courseCards[2].hasBetaLabel, 'live challenges should not have beta label');
    assert.ok(coursesPage.courseCards[3].hasBetaLabel, 'live challenges should not have beta label');
  });

  test('it renders free badges if user is a free user', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    assert.equal(coursesPage.courseCards.length, 3, 'expected 3 course cards to be present');

    assert.ok(coursesPage.courseCards[0].hasFreeLabel, 'free challenges should have free label');
    assert.notOk(coursesPage.courseCards[1].hasFreeLabel, 'paid challenges should not have free label');
    assert.notOk(coursesPage.courseCards[2].hasFreeLabel, 'paid challenges should not have free label');
  });

  test('it does not render free badges if user is a subscriber', async function (assert) {
    signInAsSubscriber(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    assert.equal(coursesPage.courseCards.length, 3, 'expected 3 course cards to be present');

    assert.notOk(coursesPage.courseCards[0].hasFreeLabel, 'free challenges should not have free label');
    assert.notOk(coursesPage.courseCards[1].hasFreeLabel, 'paid challenges should not have free label');
    assert.notOk(coursesPage.courseCards[2].hasFreeLabel, 'paid challenges should not have free label');
  });
});
