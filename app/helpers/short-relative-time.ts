import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInYears } from 'date-fns';
import { service } from '@ember/service';
import Helper from '@ember/component/helper';
import TimeService from 'codecrafters-frontend/services/time';

interface ShortRelativeTimeSignature {
  Args: {
    Positional: Array<Date | null | undefined>;
  };

  Return: string | undefined;
}

export default class ShortRelativeTime extends Helper<ShortRelativeTimeSignature> {
  @service declare time: TimeService;

  public compute(positional: ShortRelativeTimeSignature['Args']['Positional']): ShortRelativeTimeSignature['Return'] {
    if (!positional[0]) {
      return;
    }

    const now = this.time.currentTime;
    const date = positional[0];

    const years = differenceInYears(now, date);

    if (years >= 1) {
      return `${years}y ago`;
    }

    const months = differenceInMonths(now, date);

    if (months >= 1) {
      return `${months}mo ago`;
    }

    const days = differenceInDays(now, date);

    if (days >= 1) {
      return `${days}d ago`;
    }

    const hours = differenceInHours(now, date);

    if (hours >= 1) {
      return `${hours}h ago`;
    }

    const minutes = differenceInMinutes(now, date);

    if (minutes >= 1) {
      return `${minutes}m ago`;
    }

    return 'Just now';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'short-relative-time': typeof ShortRelativeTime;
  }
}
