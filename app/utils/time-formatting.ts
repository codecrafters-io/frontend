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
