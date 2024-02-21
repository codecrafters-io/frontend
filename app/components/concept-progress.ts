import Component from '@glimmer/component';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    latestConceptEngagement: ConceptEngagementModel;
  };
}

export default class ConceptProgressComponent extends Component<Signature> {
  get widthStyle(): string {
    return `width: ${this.args.latestConceptEngagement.currentProgressPercentage}%`;
  }

  rules() {
    return fade;
  }
}
