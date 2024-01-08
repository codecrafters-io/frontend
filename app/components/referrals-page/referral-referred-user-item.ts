import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralActivationModel from 'codecrafters-frontend/models/referral-activation';
import { format } from 'date-fns';

interface Signature {
  Element: HTMLElement;

  Args: {
    activation: ReferralActivationModel;
    grant: FreeUsageGrantModel | undefined;
  };

  Blocks: {
    default: [];
  };
}

export default class ReferralReferredUserItemComponent extends Component<Signature> {
  get fullActivatesAt() {
    // TODO: Temporary, prevents rendering errors
    if (!this.args.grant?.activatesAt) {
      return 'Invalid';
    }

    return format(this.args.grant?.activatesAt as Date, 'dd MMMM yyyy');
  }

  get fullExpiresAt() {
    // TODO: Temporary, prevents rendering errors
    if (!this.args.grant?.expiresAt) {
      return 'Invalid';
    }

    return format(this.args.grant?.expiresAt as Date, 'dd MMMM yyyy');
  }

  get shortActivatesAt() {
    // TODO: Temporary, prevents rendering errors
    if (!this.args.grant?.activatesAt) {
      return 'Invalid';
    }

    return format(this.args.grant?.activatesAt as Date, 'dd MMM');
  }

  get shortExpiresAt() {
    // TODO: Temporary, prevents rendering errors
    if (!this.args.grant?.expiresAt) {
      return 'Invalid';
    }

    return format(this.args.grant?.expiresAt as Date, 'dd MMM');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralReferredUserItem': typeof ReferralReferredUserItemComponent;
  }
}
