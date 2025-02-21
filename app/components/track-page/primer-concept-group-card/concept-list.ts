import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptModel from 'codecrafters-frontend/models/concept';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    conceptGroup: ConceptGroupModel;
  };
}

export default class TrackPagePrimerConceptGroupCardConceptListComponent extends Component<Signature> {
  @service declare store: Store;

  get sortedConcepts() {
    return this.args.conceptGroup.conceptSlugs.reduce((acc, slug) => {
      const concept = this.store.peekAll('concept').find((concept) => concept.slug === slug);

      if (concept) {
        acc.push(concept);
      }

      return acc;
    }, [] as ConceptModel[]);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::PrimerConceptGroupCard::ConceptList': typeof TrackPagePrimerConceptGroupCardConceptListComponent;
  }
}
