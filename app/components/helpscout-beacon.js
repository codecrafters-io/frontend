import Component from '@glimmer/component';
import { loadScript } from '../utils/load-helpscout-beacon';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HelpScoutBeaconComponent extends Component {
  @tracked beaconInitialized = false;

  constructor() {
    console.log('HelpScoutBeaconComponent constructor');
    super(...arguments);
    this.initBeacon(); // Initialize immediately on component creation
  }

  willDestroy() {
    super.willDestroy(...arguments); // Call superclass's willDestroy
    this.destroyBeacon(); // Destroy when component is removed
  }

  @action
  destroyBeacon() {
    console.log('destroyBeacon');
    if (typeof window.Beacon === 'function') {
      window.Beacon('destroy');
      this.beaconInitialized = false; // Reset the flag
    }
  }

  @action
  async initBeacon() {
    console.log('initBeacon');
    try {
      await loadScript('https://beacon-v2.helpscout.net');
      console.log('loadScript done');
      if (typeof window.Beacon === 'function') {
        window.Beacon('init', 'bb089ae9-a4ae-4114-8f7a-b660f6310158');
        console.log('HelpScout Beacon initialized.');
        this.beaconInitialized = true;
      } else {
        console.warn('HelpScout Beacon not available after script load.  Check network request.');
      }
    } catch (error) {
      console.error('Error loading HelpScout Beacon:', error);
    }
  }
}