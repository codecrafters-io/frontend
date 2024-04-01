import config from 'codecrafters-frontend/config/environment';
import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';

export default class VersionTrackerService extends Service {
  VERSION_CHECK_INTERVAL_SECONDS = 60; // 1 minute

  @tracked latestVersion: string | null = null;
  @tracked latestVersionLastFetchedAt: Date | null = null;

  get currentMajorVersion() {
    return this.#parseVersionString(this.currentVersion).major;
  }

  get currentMinorVersion() {
    return this.#parseVersionString(this.currentVersion).minor;
  }

  get currentVersion() {
    return config.x.version;
  }

  async fetchLatestVersionIfNeeded() {
    if (!this.#latestVersionNeedsFetching()) {
      return;
    }

    this.latestVersion = await fetch('/version.txt').then((response) => response.text());
    this.latestVersionLastFetchedAt = new Date();
  }

  #latestVersionNeedsFetching() {
    if (!this.latestVersionLastFetchedAt) {
      return true;
    }

    return Date.now() - this.latestVersionLastFetchedAt.getTime() > this.VERSION_CHECK_INTERVAL_SECONDS * 1000;
  }

  #parseVersionString(versionString: string) {
    const parts = versionString.split('.');

    return {
      major: parseInt(parts[0] as string),
      minor: parseInt(parts[1] as string),
      patch: parts[2], // We use git commit hashes for patch versions
    };
  }

  versionIsOutdated(latestVersionString: string) {
    const latestVersionParts = this.#parseVersionString(latestVersionString);

    return this.currentMajorVersion < latestVersionParts.major;
  }
}
