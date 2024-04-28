import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import Helper from '@ember/component/helper';

interface DateFromNowSignature {
  Args: {
    Positional: Array<Date | null | undefined>;
  }
}

export default class DateFromNow extends Helper<DateFromNowSignature> {
  timer: number | null = null;

  clearTimer() {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  compute(positional: [Date]) {
    let [date] = positional;
    this.scheduleRecompute();
    return formatDistanceStrictWithOptions({ addSuffix: true }, new Date(), date);
  }

  scheduleRecompute() {
    this.clearTimer();
    this.timer = window.setTimeout(() => this.recompute(), 1000);
  }

  willDestroy() {
    super.willDestroy();
    this.clearTimer();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'date-from-now': typeof DateFromNow;
  }
}
