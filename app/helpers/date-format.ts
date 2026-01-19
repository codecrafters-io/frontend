import { helper } from '@ember/component/helper';
import { formatWithOptions } from 'date-fns/fp';

const dateFormat = helper(function dateFormat([date]: [(Date | null | undefined)?] = [], { format = 'P' }: { format?: string } = {}): string {
  if (date === undefined || date === null) {
    return '';
  }

  return formatWithOptions({}, format, date);
});

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'date-format': typeof dateFormat;
  }
}

export default dateFormat;
