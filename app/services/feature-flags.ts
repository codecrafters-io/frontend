import Service, { inject as service } from '@ember/service';
import AnalyticsEventTrackerService from './analytics-event-tracker';
import AuthenticatorService from './authenticator';
import type User from 'codecrafters-frontend/models/user';

export default class FeatureFlagsService extends Service {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;

  private notifiedFeatureFlags: Set<string>;

  constructor(...args: [object | undefined] | []) {
    super(...args);
    this.notifiedFeatureFlags = new Set();
  }

  get canSeeConceptsIndex(): boolean {
    return Boolean(this.currentUser && (this.currentUser.isStaff || this.currentUser.isConceptAuthor));
  }

  get canSeeSplitUpGitCommandsForStage1(): boolean {
    return Boolean(this.currentUser?.isStaff || this.getFeatureFlagValue('can-see-split-up-git-commands-for-stage-1') === 'test');
  }

  get currentUser(): User | null {
    return this.authenticator.currentUser;
  }

  getFeatureFlagValue(flagName: string): string | null | undefined {
    const value = this.currentUser?.featureFlags?.[flagName];

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
