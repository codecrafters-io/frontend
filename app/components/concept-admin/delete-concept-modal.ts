import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type ConceptModel from 'codecrafters-frontend/models/concept';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
    onClose?: () => void;
  };
}

export default class DeleteConceptModal extends Component<Signature> {
  @service declare router: RouterService;
  @action
  async deleteConcept() {
    this.router.transitionTo('concepts');
    await this.args.concept.destroyRecord();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::DeleteConceptModal': typeof DeleteConceptModal;
  }
}
