import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;
}

export default class FreeWeeksLeftButtonComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get freeWeeksLeftCopy() {
    let timeRemaining;
    const freeUsageExpiryDistanceToNow = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date).split(' ');

    if (freeUsageExpiryDistanceToNow?.includes('second') || freeUsageExpiryDistanceToNow?.includes('minute')) {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'minute', roundingMethod: 'ceil' });
    } else if (freeUsageExpiryDistanceToNow?.includes('hour')) {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'hour', roundingMethod: 'ceil' });
    } else {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'day', roundingMethod: 'ceil' });
    }

    return `${timeRemaining} free`;
  }

  get freeWeeksLeftTooltip() {
    return `Your free usage expires on ${format(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, 'PPpp')}`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::FreeWeeksLeftButton': typeof FreeWeeksLeftButtonComponent;
  }
}
