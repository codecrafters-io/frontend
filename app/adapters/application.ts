import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';
import type SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';

  @service declare sessionTokenStorage: SessionTokenStorageService;
  @service declare versionTracker: VersionTrackerService;

  get headers() {
    const headers: Record<string, string> = {};

    if (this.sessionTokenStorage.currentToken) {
      headers['x-session-token'] = this.sessionTokenStorage.currentToken;
    }

    headers['x-codecrafters-client-version'] = this.versionTracker.currentVersion;

    return headers;
  }

  get host() {
    return config.x.backendUrl;
  }
}
