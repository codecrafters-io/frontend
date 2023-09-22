import { helper } from '@ember/component/helper';
import { formatDistanceStrictWithOptions } from 'date-fns/fp';

export default helper(function dateFromNow(
  [date]: [(Date | null | undefined)?],
  { currentDate = new Date() }: { currentDate?: Date | undefined } = {},
): string {
  if (date === undefined || date === null) {
    return '';
  }

  return formatDistanceStrictWithOptions({ addSuffix: true }, currentDate, date);
});
