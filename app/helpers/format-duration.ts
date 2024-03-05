import { helper } from '@ember/component/helper';
import { formatDuration as libFormatDuration, intervalToDuration } from 'date-fns';

export default helper(function formatDuration([timeDurationInSeconds]: [number] /*, named*/) {
  const duration = intervalToDuration({ start: 0, end: timeDurationInSeconds * 1000 });

  if (timeDurationInSeconds > 60) {
    duration.seconds = 0;
  }

  return libFormatDuration(duration);
});
