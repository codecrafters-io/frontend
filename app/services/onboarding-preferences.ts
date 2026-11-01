import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LocalStorageService from 'codecrafters-frontend/services/local-storage';
import type { OnboardingPreferences } from 'codecrafters-frontend/utils/onboarding-recommendations';

export default class OnboardingPreferencesService extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare localStorage: LocalStorageService;
  @tracked private saved: { userId: string; preferences: OnboardingPreferences } | null = null;

  get preferences(): OnboardingPreferences | null {
    const userId = this.authenticator.currentUserId;
    if (!userId) return null;
    if (this.saved?.userId === userId) return this.saved.preferences;

    try {
      const value = JSON.parse(this.localStorage.getItem(`onboarding-preferences:${userId}`) || 'null');

      if (
        value &&
        ['goal', 'role', 'experience', 'companySize'].every((key) => typeof value[key] === 'string') &&
        (value.referralSurveyId === null || typeof value.referralSurveyId === 'string')
      )
        return value;
    } catch {
      // An unavailable browser store must not block onboarding or the catalog.
    }

    return null;
  }

  save(preferences: OnboardingPreferences) {
    const userId = this.authenticator.currentUserId;
    if (!userId) return;

    this.saved = { userId, preferences };

    try {
      this.localStorage.setItem(`onboarding-preferences:${userId}`, JSON.stringify(preferences));
    } catch {
      // Personalization still applies to this session when browser storage is unavailable.
    }
  }
}
