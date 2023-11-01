import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptModel from 'codecrafters-frontend/models/concept';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Signature {
  concept: ConceptModel;
  conceptGroup: ConceptGroupModel;
  nextConcept: ConceptModel | null;
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

  @action
  handleUpcomingConceptInserted(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
