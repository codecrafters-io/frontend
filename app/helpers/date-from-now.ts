import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import TimeService from 'codecrafters-frontend/services/time'

interface DateFromNowSignature {
  Args: {
    Positional: Array<Date | null | undefined>;
  }
}

export default class DateFromNow extends Helper<DateFromNowSignature> {
  @service declare time: TimeService;

  compute(positional: [Date]) {
    let [date] = positional;
    return formatDistanceStrictWithOptions({ addSuffix: true }, this.time.currentTime, date);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'date-from-now': typeof DateFromNow;
  }
}
