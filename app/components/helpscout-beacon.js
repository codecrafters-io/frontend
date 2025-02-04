import Component from '@glimmer/component';
import { loadScript } from '../utils/load-helpscout-beacon';
import { action } from '@ember/object';

export default class HelpScoutBeaconComponent extends Component {
  @action
  async initBeacon() {
    try {
      await loadScript('https://beacon-v2.helpscout.net', () => {
        if (typeof window.Beacon === 'function') {
          window.Beacon('init', 'bb089ae9-a4ae-4114-8f7a-b660f6310158');
          console.log('HelpScout Beacon loaded successfully.');
        } else {
          console.error('HelpScout Beacon is not available on the window object.');
        }
      });
    } catch (error) {
      console.error('Error loading HelpScout Beacon:', error);
    }
  }

  @action
  destroyBeacon() {
    if (typeof window.Beacon === 'function') {
      window.Beacon('destroy');
    }
  }
}