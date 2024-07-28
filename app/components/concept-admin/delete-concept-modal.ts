import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type ConceptModel from 'codecrafters-frontend/models/concept';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
    onClose?: () => void;
  };
}

export default class DeleteConceptModalComponent extends Component<Signature> {
  @service declare router: RouterService;
  @service declare store: Store;

  @action
  async deleteConcept() {
    this.router.transitionTo('concepts');
    await this.args.concept.destroyRecord();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::DeleteConceptModal': typeof DeleteConceptModalComponent;
  }
}
