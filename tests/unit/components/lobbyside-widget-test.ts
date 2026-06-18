import { lobbysideCustomFields } from 'codecrafters-frontend/components/lobbyside-widget';
import { module, test } from 'qunit';
import type UserModel from 'codecrafters-frontend/models/user';

module('Unit | Component | lobbyside-widget', function () {
  function createUser(overrides: Partial<UserModel> = {}): UserModel {
    return {
      createdAt: new Date('2023-04-15T10:30:00.000Z'),
      isVip: false,
      activeSubscription: null,
      hasActiveSubscription: false,
      teamHasActiveSubscription: false,
      courseParticipations: [],
      ...overrides,
    } as unknown as UserModel;
  }

  test('returns empty fields for a missing user', function (assert) {
    assert.deepEqual(lobbysideCustomFields(null), {
      stages_completed: '0',
      signed_up_date: '',
      subscription_type: '',
      other_emails: '',
    });
  });

  test('formats signed_up_date as an ISO calendar date', function (assert) {
    const user = createUser({ createdAt: new Date('2023-04-15T10:30:00.000Z') });

    assert.strictEqual(lobbysideCustomFields(user).signed_up_date, '2023-04-15');
  });

  test('sums completed stage slugs across all course participations', function (assert) {
    const user = createUser({
      courseParticipations: [{ completedStageSlugs: ['s1', 's2', 's3'] }, { completedStageSlugs: ['s1'] }, { completedStageSlugs: [] }],
    } as unknown as Partial<UserModel>);

    assert.strictEqual(lobbysideCustomFields(user).stages_completed, '4');
  });

  test('subscription_type prefers lifetime over every other signal', function (assert) {
    const user = createUser({
      isVip: true,
      hasActiveSubscription: true,
      teamHasActiveSubscription: true,
      activeSubscription: { isLifetimeMembership: true } as UserModel['activeSubscription'],
    });

    assert.strictEqual(lobbysideCustomFields(user).subscription_type, 'lifetime');
  });

  test('subscription_type falls back through individual, team, vip, then free', function (assert) {
    assert.strictEqual(lobbysideCustomFields(createUser({ hasActiveSubscription: true })).subscription_type, 'individual');

    assert.strictEqual(lobbysideCustomFields(createUser({ teamHasActiveSubscription: true })).subscription_type, 'team');

    assert.strictEqual(lobbysideCustomFields(createUser({ isVip: true })).subscription_type, 'vip');

    assert.strictEqual(lobbysideCustomFields(createUser()).subscription_type, 'free');
  });

  test('other_emails joins every non-primary email, comma-separated', function (assert) {
    const user = createUser({
      primaryEmailAddress: 'primary@example.com',
      emailAddresses: [{ value: 'primary@example.com' }, { value: 'work@example.com' }, { value: 'school@example.com' }],
    } as unknown as Partial<UserModel>);

    assert.strictEqual(lobbysideCustomFields(user).other_emails, 'work@example.com, school@example.com');
  });

  test('other_emails excludes the primary email and is empty when it is the only one', function (assert) {
    const user = createUser({
      primaryEmailAddress: 'primary@example.com',
      emailAddresses: [{ value: 'primary@example.com' }],
    } as unknown as Partial<UserModel>);

    assert.strictEqual(lobbysideCustomFields(user).other_emails, '');
  });

  test('other_emails dedupes and drops blank values', function (assert) {
    const user = createUser({
      primaryEmailAddress: 'primary@example.com',
      emailAddresses: [{ value: 'work@example.com' }, { value: '  work@example.com  ' }, { value: '' }, { value: 'alt@example.com' }],
    } as unknown as Partial<UserModel>);

    assert.strictEqual(lobbysideCustomFields(user).other_emails, 'work@example.com, alt@example.com');
  });

  test('other_emails is empty when the user has no email addresses', function (assert) {
    const user = createUser({ primaryEmailAddress: 'primary@example.com', emailAddresses: [] } as unknown as Partial<UserModel>);

    assert.strictEqual(lobbysideCustomFields(user).other_emails, '');
  });
});
