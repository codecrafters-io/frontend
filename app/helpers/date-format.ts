import { helper } from '@ember/component/helper';
import { formatWithOptions } from 'date-fns/fp';

export default helper(function dateFormat([date]: [(Date | null | undefined)?] = [], { format = 'P' }: { format?: string } = {}): string {
  if (date === undefined || date === null) {
    return '';
  }

  return formatWithOptions({}, format, date);
});
