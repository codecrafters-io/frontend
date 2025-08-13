import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import ConceptModel from 'codecrafters-frontend/models/concept';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    conceptGroup: ConceptGroupModel;
  };
}

export default class ConceptList extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
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

  @action
  @waitFor
  async handleDidInsertContainerElement() {
    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('concept-engagement', { include: 'concept,user' });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::PrimerConceptGroupSection::ConceptList': typeof ConceptList;
  }
}
