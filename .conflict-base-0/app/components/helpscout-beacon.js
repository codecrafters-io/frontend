import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';
import * as Sentry from '@sentry/ember';
import { service } from '@ember/service';

export default class HelpScoutBeacon extends Component {
  @service fastboot;

  @tracked beaconInitialized = false;

  constructor() {
    super(...arguments);
    this.initBeacon();
  }

  @action
  destroyBeacon() {
    if (typeof window.Beacon === 'function') {
      window.Beacon('destroy');
      this.beaconInitialized = false;
    }
  }

  @action
  async initBeacon() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    if (typeof window.Beacon === 'function') {
      window.Beacon('init', config.x.helpscoutBeaconId);
      this.beaconInitialized = true;
    } else {
      console.log('HelpScout Beacon not available after script load.');
      Sentry.captureMessage('HelpScout Beacon not available after script load.');
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.destroyBeacon();
  }
}
