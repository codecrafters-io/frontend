import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import ConceptModel from 'codecrafters-frontend/models/concept';

interface Signature {
  concept: ConceptModel;
  onProgressPercentageChange: (percentage: number) => void;
}

export default class ContentComponent extends Component<Signature> {
  @tracked currentProgressPercentage = 0;

  get hasCompletedConcept() {
    return this.currentProgressPercentage === 100;
  }

  @action
  handleCompletionContainerInserted(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  @action
  handleProgressPercentageChanged(progressPercentage: number) {
    this.currentProgressPercentage = progressPercentage;
  }
}
