import Service, { inject as service } from '@ember/service';

export default class FeatureFlagsService extends Service {
  @service analyticsEventTracker;
  @service authenticator;

  constructor() {
    super(...arguments);

    this.notifiedFeatureFlags = new Set();
  }

  get canSeeConceptsIndex() {
    return this.currentUser && (this.currentUser.isStaff || this.currentUser.isConceptAuthor);
  }

  get canSeeShortInstructionsForStage2() {
    return this.currentUser?.isStaff || this.getFeatureFlagValue('can-see-short-instructions-for-stage-2') === 'test';
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get hideTestRunnerCardBeforeUserHasSubmitted() {
    return this.currentUser?.isStaff || this.getFeatureFlagValue('hide-test-runner-card-before-user-has-submitted') === 'test';
  }

  getFeatureFlagValue(flagName) {
    const value = this.currentUser && this.currentUser.featureFlags && this.currentUser.featureFlags[flagName];

    if (!this.notifiedFeatureFlags.has(flagName)) {
      this.analyticsEventTracker.track('feature_flag_called', {
        feature_flag: flagName,
        feature_flag_response: value,
      });

      this.notifiedFeatureFlags.add(flagName);
    }

    return value;
  }
}
