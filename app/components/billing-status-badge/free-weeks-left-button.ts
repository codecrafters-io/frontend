import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;
  Args: {
    size: 'small' | 'large';
  };
}

export default class FreeWeeksLeftButton extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get freeWeeksLeftCopy() {
    let timeRemaining;
    const freeUsageExpiryDistanceToNow = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date);

    if (freeUsageExpiryDistanceToNow?.includes('second') || freeUsageExpiryDistanceToNow?.includes('minute')) {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'minute', roundingMethod: 'ceil' });
    } else if (freeUsageExpiryDistanceToNow?.includes('hour')) {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'hour', roundingMethod: 'ceil' });
    } else {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'day', roundingMethod: 'ceil' });
    }

    return `${timeRemaining} free`;
  }

  get freeWeeksLeftTooltipCopy() {
    return `Your free content access expires on ${format(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, 'PP')}.`;
  }

  get linkButtonSize() {
    // arg:small -> PrimaryLinkButton size:extra-small
    // arg:large -> small
    return this.args.size === 'large' ? 'small' : 'extra-small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BillingStatusBadge::FreeWeeksLeftButton': typeof FreeWeeksLeftButton;
  }
}
