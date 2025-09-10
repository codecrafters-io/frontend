import Component from '@glimmer/component';

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

export default class PricingPlanCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'PayPage::PricingPlanCard': typeof PricingPlanCard;
  }
}
