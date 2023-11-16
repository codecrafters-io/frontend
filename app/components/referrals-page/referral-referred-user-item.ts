import Component from '@glimmer/component';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';

interface Signature {
  Element: HTMLElement;

  Args: {
    activationAndGrant: {
      activation: ReferralActivationModel;
      grant: {
        shortActivatesAt: string;
        shortExpiresAt: string;
        fullActivatesAt: string;
        fullExpiresAt: string;
      };
    };
  };

  Blocks: {
    default: [];
  };
}

export default class ReferralReferredUserItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralReferredUserItem': typeof ReferralReferredUserItemComponent;
  }
}
