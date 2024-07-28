import Component from '@glimmer/component';
import type AffiliateReferralModel from 'codecrafters-frontend/models/affiliate-referral';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    affiliateReferral: AffiliateReferralModel;
  };
}

export default class AffiliateReferredUserItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliatePage::AffiliateReferredUserItem': typeof AffiliateReferredUserItemComponent;
  }
}
