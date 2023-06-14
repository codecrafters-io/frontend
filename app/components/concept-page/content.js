import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ContentComponent extends Component {
  @tracked currentProgressPercentage = 0;

  @action
  handleProgressPercentageChanged(progressPercentage) {
    this.currentProgressPercentage = progressPercentage;
  }

  get hasCompletedConcept() {
    return this.currentProgressPercentage === 100;
  }

  @action
  handleCompletionContainerInserted(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
