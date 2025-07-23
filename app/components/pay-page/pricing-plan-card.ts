import Component from '@glimmer/component';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { service } from '@ember/service';

export interface FeatureDescription {
  text: string;
  link?: string;
}

interface Signature {
  Element: HTMLDivElement;

  Args: {
    description: string;
    featureDescriptions: FeatureDescription[];
    onStartMembershipButtonClick: () => void;
    isRecommended?: boolean;
    subtitle: string;
    title: string;
  };
}

export default class PricingPlanCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::PricingPlanCard': typeof PricingPlanCardComponent;
  }
}
