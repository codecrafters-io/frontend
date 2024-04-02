import config from 'codecrafters-frontend/config/environment';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import Service, { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';

export default class VersionTrackerService extends Service {
  static VERSION_CHECK_INTERVAL_SECONDS = 30; // 30 seconds

  @tracked latestVersion: string | null = null;
  @tracked latestVersionLastFetchedAt: Date | null = null;

  @service declare fastboot: FastBootService;

  get currentMajorVersion() {
    return this.#parseVersionString(this.currentVersion).major;
  }

  get currentMinorVersion() {
    return this.#parseVersionString(this.currentVersion).minor;
  }

  get currentVersion() {
    return config.x.version;
  }

  get currentVersionIsIncompatible() {
    if (!this.latestVersion) {
      return false; // Without a latest version, we can't determine if the current version is incompatible
    }

    const latestVersionParts = this.#parseVersionString(this.latestVersion);

    return this.currentMajorVersion !== latestVersionParts.major;
  }

  get currentVersionIsOutdated() {
    if (!this.latestVersion) {
      return false; // Without a latest version, we can't determine if the current version is outdated
    }

    return this.currentVersion !== this.latestVersion;
  }

  async fetchLatestVersionIfNeeded() {
    // Don't fire requests during FastBoot runs
    if (this.fastboot.isFastBoot) {
      return;
    }

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

    return Date.now() - this.latestVersionLastFetchedAt.getTime() > VersionTrackerService.VERSION_CHECK_INTERVAL_SECONDS * 1000;
  }

  #parseVersionString(versionString: string) {
    const parts = versionString.split('.');

    return {
      major: parseInt(parts[0] as string),
      minor: parseInt(parts[1] as string),
      patch: parts[2], // We use git commit hashes for patch versions
    };
  }
}
