import Component from '@glimmer/component';
import ConceptGroupModel from 'codecrafters-frontend/models/concept-group';
import LanguageModel from 'codecrafters-frontend/models/language';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    conceptGroup: ConceptGroupModel;
  };
}

export default class TrackPagePrimerConceptGroupSection extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked conceptListIsExpanded = false;

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.conceptListIsExpanded = false;
    });
  }

  @action
  handleSectionClick() {
    if (this.conceptListIsExpanded) {
      return;
    }

    if (this.authenticator.isAuthenticated) {
      this.conceptListIsExpanded = true;
    } else {
      this.router.transitionTo('concept', this.args.conceptGroup.conceptSlugs[0]!);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::PrimerConceptGroupSection': typeof TrackPagePrimerConceptGroupSection;
  }
}
