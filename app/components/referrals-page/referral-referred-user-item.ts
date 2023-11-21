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
    return format(this.args.grant?.activatesAt as Date, 'dd MMMM yyyy');
  }

  get fullExpiresAt() {
    return format(this.args.grant?.expiresAt as Date, 'dd MMMM yyyy');
  }

  get shortActivatesAt() {
    return format(this.args.grant?.activatesAt as Date, 'dd MMM');
  }

  get shortExpiresAt() {
    return format(this.args.grant?.expiresAt as Date, 'dd MMM');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralsPage::ReferralReferredUserItem': typeof ReferralReferredUserItemComponent;
  }
}
