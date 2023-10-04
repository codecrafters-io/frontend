import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import ConceptModel from 'codecrafters-frontend/models/concept';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    concept: ConceptModel;
  };
};

type Tab = {
  icon: string;
  name: string;
  slug: string;
  route: string;
  models: unknown[];
  isActive: boolean;
};

export default class ConceptAdminHeaderComponent extends Component<Signature> {
  @service declare router: RouterService;

  get tabs(): Tab[] {
    return [
      {
        icon: 'information-circle',
        name: 'Basic Details',
        slug: 'basic-details',
        route: 'concept-admin.basic-details',
        models: [this.args.concept.slug],
        isActive: this.router.currentRouteName === 'concept-admin.basic-details',
      },
    ];
  }
}
