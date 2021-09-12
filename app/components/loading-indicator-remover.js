import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LoadingIndicatorRemoverComponent extends Component {
  @action
  handleInsert() {
    const elems = document.querySelectorAll(`.ember-load-indicator`);

    /**
     * Very important to iterate over the NodeList this way,
     * and remove the DOM elements via removeChild to maintain ie11
     * compatibility
     */
    for (let i = 0; i < elems.length; i++) {
      elems[i].parentNode.removeChild(elems[i]);
    }
  }
}
