import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class HeadLayout extends Component {
  @service('-document') document;

  /**
   * If true, this will tear down any existing head on init of this component.
   * This is useful if there is a head built with fastboot - it will then be torn down when this is initialized in the browser.
   * If you do not want this behavior, you can set this to false.
   * @public
   */
  shouldTearDownOnInit = true;

  /**
   * The element to render into. Defaults to <head> in `init`, overridable for our own tests only.
   * @private
   */
  headElement = this.args.headElement || this.document.head;

  constructor() {
    super(...arguments);

    if (this.shouldTearDownOnInit) {
      this._tearDownHead();
    }
  }

  _isFastboot() {
    return typeof FastBoot !== 'undefined';
  }

  /**
   * Tear down any previous head, if there was one.
   * @private
   */
  _tearDownHead() {
    if (this._isFastboot()) {
      return;
    }

    // clear fast booted head (if any)
    let document = this.document;
    let startMeta = document.querySelector('meta[name="ember-cli-head-start"]');
    let endMeta = document.querySelector('meta[name="ember-cli-head-end"]');

    if (startMeta && endMeta) {
      let el = startMeta.nextSibling;

      while (el && el !== endMeta) {
        document.head.removeChild(el);
        el = startMeta.nextSibling;
      }

      document.head.removeChild(startMeta);
      document.head.removeChild(endMeta);
    }
  }
}
