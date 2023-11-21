import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import { formatDistanceToNowStrict } from 'date-fns';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;
}

export default class FreeWeeksLeftBadgeComponent extends Component<Signature> {
  @service authenticator!: AuthenticatorService;

  get copy() {
    let timeRemaining;
    const [_value, unit] = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date).split(' ');

    if (unit?.includes('second') || unit?.includes('minute')) {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'minute', roundingMethod: 'ceil' });
    } else if (unit?.includes('hour')) {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'hour', roundingMethod: 'ceil' });
    } else {
      timeRemaining = formatDistanceToNowStrict(this.currentUser?.lastFreeUsageGrantExpiresAt as Date, { unit: 'day', roundingMethod: 'ceil' });
    }

    return `${timeRemaining} free`
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::FreeWeeksBadge': typeof FreeWeeksLeftBadgeComponent;
  }
}
