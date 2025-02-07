import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

  willDestroy() {
    super.willDestroy(...arguments);
    this.destroyBeacon();
  }

  @action
  async initBeacon() {
    try {
      if (typeof window.Beacon === 'function') {
        window.Beacon('init', 'bb089ae9-a4ae-4114-8f7a-b660f6310158');
        this.beaconInitialized = true;
      } else {
        console.warn('HelpScout Beacon not available after script load.  Check network request.');
      }
    } catch (error) {
      console.error('Error loading HelpScout Beacon:', error);
    }
  }
}
