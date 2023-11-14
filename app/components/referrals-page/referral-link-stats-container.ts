import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import { format } from 'date-fns';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLElement;

  Args: {
    freeUsageGrants: FreeUsageGrantModel[];
  };
}

export default class ReferralLinkStatsContainerComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get activeFreeUsageGrantsCount() {
    return this.args.freeUsageGrants.filter((grant) => grant.isActive).length;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get freeUsageGrantsCount() {
    return this.args.freeUsageGrants.length;
  }

  get freeUsageGrantsExpireAt() {
    // @ts-ignore
    const expiresAt = this.args.freeUsageGrants.sortBy('expiresAt').lastObject.expiresAt;

    return format(expiresAt, 'dd MMM yyyy');
  }

  get userHasActiveFreeUsageGrants() {
    return this.activeFreeUsageGrantsCount > 0;
  }
}
