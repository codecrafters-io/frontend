import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import ConceptModel from 'codecrafters-frontend/models/concept';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
  };
}

export default class ShareConceptContainerComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @action
  handleCopyButtonClick() {
    this.analyticsEventTracker.track('clicked_share_concept_button', {
      concept_id: this.args.concept.id,
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::ShareConceptContainer': typeof ShareConceptContainerComponent;
  }
}
