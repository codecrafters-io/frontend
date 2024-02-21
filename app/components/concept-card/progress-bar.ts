import Component from '@glimmer/component';
import ConceptEngagementModel from 'codecrafters-frontend/models/concept-engagement';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    latestConceptEngagement: ConceptEngagementModel;
  };
}

export default class ProgressBarComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptCard::ProgressBar': typeof ProgressBarComponent;
  }
}
