import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

export default class HelpScoutBeaconComponent extends Component {
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
    try {
      if (typeof window.Beacon === 'function') {
        window.Beacon('init', config.x.helpscoutBeaconId);
        this.beaconInitialized = true;
      } else {
        console.warn('HelpScout Beacon not available after script load.  Check network request.');
      }
    } catch (error) {
      console.error('Error loading HelpScout Beacon:', error);
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.destroyBeacon();
  }
}
