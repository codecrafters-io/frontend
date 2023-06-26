import Service, { inject as service } from '@ember/service';

export default class FeatureFlagsService extends Service {
  @service authenticator;
  @service store;

  constructor() {
    super(...arguments);

    this.notifiedFeatureFlags = new Set();
  }

  get canSeeBadges() {
    if (this.currentUser && this.currentUser.isStaff) {
      return true;
    }

    return this.getFeatureFlagValue('stage-1-badges') === 'test';
  }

  get canSeeConceptsIndex() {
    return this.currentUser && this.currentUser.isStaff;
  }

  get canSeeStageCompletionVideos() {
    if (this.currentUser && this.currentUser.isStaff) {
      return true;
    }

    return this.getFeatureFlagValue('can-see-stage-completion-videos') === 'test';
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get canSeeDiscountBanner() {
    if (this.currentUser && this.currentUser.isStaff) {
      return true;
    }

    if (this.currentUser && !this.currentUser.hasActiveSubscription) {
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
