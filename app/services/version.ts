import config from 'codecrafters-frontend/config/environment';
import Service from '@ember/service';

export default class VersionService extends Service {
  get majorVersion() {
    return this.#parseVersionString(config.x.version).major;
  }

  get minorVersion() {
    return this.#parseVersionString(config.x.version).minor;
  }

  get versionString() {
    return config.x.version;
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
