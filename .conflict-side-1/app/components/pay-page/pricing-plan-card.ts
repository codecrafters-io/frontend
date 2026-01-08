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
    ctaText: string;
    description: string;
    featureDescriptions: FeatureDescription[];
    isRecommended?: boolean;
    onCtaClick: () => void;
    subtitle: string;
    title: string;
  };
}

export default class PricingPlanCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::PricingPlanCard': typeof PricingPlanCard;
  }
}
