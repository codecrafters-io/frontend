import { helper } from '@ember/component/helper';
import { formatDuration, intervalToDuration } from 'date-fns';

export default helper(function formatTimeDuration([timeDurationInSeconds]: [number] /*, named*/) {
  const duration = intervalToDuration({ start: 0, end: timeDurationInSeconds * 1000 });

  if (timeDurationInSeconds > 60) {
    duration.seconds = 0;
  }

  return formatDuration(duration);
});
