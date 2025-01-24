import * as Sentry from '@sentry/ember';

export function formatTimeDurationForCoundown(laterDate: Date, earlierDate: Date): string {
  const distanceInSeconds = Math.floor((laterDate.getTime() - earlierDate.getTime()) / 1000);
  const hoursLeft = Math.floor(distanceInSeconds / 60 / 60);
  const minutesLeft = Math.floor(distanceInSeconds / 60) - hoursLeft * 60;
  const secondsLeft = distanceInSeconds - hoursLeft * 60 * 60 - minutesLeft * 60;

  const hoursLeftStr = `${hoursLeft.toString().padStart(2, '0')}h`;
  const minutesLeftStr = `${minutesLeft.toString().padStart(2, '0')}m`;
  const secondsLeftStr = `${secondsLeft.toString().padStart(2, '0')}s`;

  if (distanceInSeconds < 0) {
    Sentry.captureMessage(`Received negative time duration for discount countdown notice`, {
      extra: {
        expiryDate: laterDate,
        currentDate: earlierDate,
      },
    });

    return '00s';
  }

  if (hoursLeft > 0) {
    return `${hoursLeftStr}:${minutesLeftStr}:${secondsLeftStr}`;
  }

  if (minutesLeft > 0) {
    return `${minutesLeftStr}:${secondsLeftStr}`;
  }

  return `${secondsLeftStr}`;
}

export function formatTimeDurationForBadge(laterDate: Date, earlierDate: Date): string {
  const distanceInSeconds = Math.floor((laterDate.getTime() - earlierDate.getTime()) / 1000);
  const hoursLeft = Math.floor(distanceInSeconds / 60 / 60);
  const minutesLeft = Math.floor(distanceInSeconds / 60) - hoursLeft * 60;
  const secondsLeft = distanceInSeconds - hoursLeft * 60 * 60 - minutesLeft * 60;

  // TODO:
  // More time > 24 hours we need to show `X days left`
  // And round up to the nearest day
  if (distanceInSeconds < 0) {
    return '0 second';
  }

  if (hoursLeft > 0) {
    return formatTimeDurationSingularOrPlural(hoursLeft, 'hour');
  }

  if (minutesLeft > 0) {
    return formatTimeDurationSingularOrPlural(minutesLeft, 'minute');
  }

  return formatTimeDurationSingularOrPlural(secondsLeft, 'second');
}

export function formatTimeDurationSingularOrPlural(duration: number, unit: string): string {
  if (duration === 1) {
    return `1 ${unit}`;
  }

  return `${duration} ${unit}s`;
}
