import Service, { inject as service } from '@ember/service';

export default class FeatureFlagsService extends Service {
  @service('current-user') currentUserService;
  @service store;

  constructor() {
    super(...arguments);

    this.notifiedFeatureFlags = new Set();
  }

  get canSeePulsingSolutionsButtonForFirstStage() {
    return this.getFeatureFlagValue('pulsing-solutions-button') === 'test';
  }

  get canSeeBadges() {
    return this.currentUser && this.currentUser.isStaff;
  }

  get canSeeStageCompletionVideos() {
    return this.currentUser && this.currentUser.isStaff;
  }

  // Either 'control', 'explain', or 'icon-with-counts'
  get solutionCommentsButtonVariant() {
    return this.getFeatureFlagValue('solution-comments-button') || 'control';
  }

  get cannotUseTrial() {
    return this.getFeatureFlagValue('no-trials') === 'test';
  }

  get currentUser() {
    return this.currentUserService.record;
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
