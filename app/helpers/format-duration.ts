import { helper } from '@ember/component/helper';
import { formatDuration as libFormatDuration, intervalToDuration } from 'date-fns';

const formatDuration = helper(function formatDuration([durationInSeconds]: [number] /*, named*/) {
  const duration = intervalToDuration({ start: 0, end: durationInSeconds * 1000 });

  return libFormatDuration(duration);
});

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    formatDuration: typeof formatDuration;
  }
}

export default formatDuration;
