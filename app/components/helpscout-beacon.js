import Component from '@glimmer/component';
import { action } from '@ember/object';
import { loadBeaconScript } from '../utils/load-helpscout-beacon';

export default class HelpscoutBeaconComponent extends Component {
  @action
  destroyBeacon() {
    // Clean up Beacon when component is destroyed
    if (window.Beacon) {
      window.Beacon('destroy');
    }
  }

  @action
  async initBeacon() {
    await loadBeaconScript();

    // Apply any configuration passed to the component
    if (this.args.config) {
      window.Beacon('config', this.args.config);
    }
  }
}
