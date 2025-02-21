import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import LanguageModel from 'codecrafters-frontend/models/language';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    conceptGroup: ConceptGroupModel;
  };
}

export default class TrackPagePrimerConceptGroupSectionComponent extends Component<Signature> {
  @tracked conceptListIsExpanded = false;

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.conceptListIsExpanded = false;
    });
  }

  @action
  handleSectionClick() {
    if (!this.conceptListIsExpanded) {
      this.conceptListIsExpanded = true;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::PrimerConceptGroupSection': typeof TrackPagePrimerConceptGroupSectionComponent;
  }
}
