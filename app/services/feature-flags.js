import Service, { inject as service } from '@ember/service';

export default class FeatureFlagsService extends Service {
  @service authenticator;
  @service store;

  constructor() {
    super(...arguments);

    this.notifiedFeatureFlags = new Set();
  }

  get canSeeConceptsIndex() {
    return this.currentUser && this.currentUser.isStaff;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get canSeeDiscountBanner() {
    if (this.currentUser && this.currentUser.isStaff) {
      return true;
    }

    if (
      this.currentUser &&
      this.currentUser.hasActiveSubscription &&
      this.currentUser.isEligibleForEarlyBirdDiscount
    ) {
      return false;
    }

    return this.getFeatureFlagValue('can-see-banner') === 'test';
  }

  getFeatureFlagValue(flagName) {
    const value = this.currentUser && this.currentUser.featureFlags && this.currentUser.featureFlags[flagName];

    if (!this.notifiedFeatureFlags.has(flagName)) {
      this.store
        .createRecord('analytics-event', {
          name: 'feature_flag_called',
          properties: { feature_flag: flagName, feature_flag_response: value },
        })
        .save();

      this.notifiedFeatureFlags.add(flagName);
    }

    return value;
  }
}
