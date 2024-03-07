import { helper } from '@ember/component/helper';
import { formatDistanceStrictWithOptions } from 'date-fns/fp';

const dateFromNow = helper(function dateFromNow(
  [date]: [(Date | null | undefined)?],
  { currentDate = new Date() }: { currentDate?: Date | undefined } = {},
): string {
  if (date === undefined || date === null) {
    return '';
  }

  return formatDistanceStrictWithOptions({ addSuffix: true }, currentDate, date);
});

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'date-from-now': typeof dateFromNow;
  }
}

export default dateFromNow;
