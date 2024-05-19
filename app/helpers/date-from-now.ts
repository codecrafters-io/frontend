import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import TimeService from 'codecrafters-frontend/services/time';

interface DateFromNowSignature {
  Args: {
    Positional: Array<Date | null | undefined>;
  };

  Return: string | undefined;
}

export default class DateFromNow extends Helper<DateFromNowSignature> {
  @service declare time: TimeService;

  public compute(positional: DateFromNowSignature['Args']['Positional']): DateFromNowSignature['Return'] {
    if (!positional[0]) {
      return;
    }

    return formatDistanceStrictWithOptions({ addSuffix: true }, this.time.currentTime, positional[0]);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'date-from-now': typeof DateFromNow;
  }
}
