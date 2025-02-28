import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import { posthog } from 'posthog-js';
import type FastbootService from 'ember-cli-fastboot/services/fastboot';
import type SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';

  @service declare fastboot: FastbootService;
  @service declare sessionTokenStorage: SessionTokenStorageService;
  @service declare versionTracker: VersionTrackerService;

  get headers() {
    const headers: Record<string, string> = {};

    if (this.sessionTokenStorage.currentToken) {
      headers['x-session-token'] = this.sessionTokenStorage.currentToken;
    }

    headers['x-codecrafters-client-version'] = this.versionTracker.currentVersion;

    try {
      headers['x-posthog-session-id'] = posthog.get_session_id();
    } catch {
      // High volume, affects Sentry quota
      console.log('posthog.get_session_id error');
      // Sentry.captureException(error);
    }

    return headers;
  }

  get host() {
    return config.x.backendUrl;
  }

  shouldBackgroundReloadAll() {
    // Don't use background reloading under FastBoot, otherwise it will run
    // after the app is destroyed and crash the build in a very funny way.
    return !this.fastboot.isFastBoot;
  }

  shouldBackgroundReloadRecord() {
    // Don't use background reloading under FastBoot, otherwise it will run
    // after the app is destroyed and crash the build in a very funny way.
    return !this.fastboot.isFastBoot;
  }
}
