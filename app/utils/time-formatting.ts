export function formatTimeLeft(expiresAt: Date, currentTime: Date): string {
  const distanceInSeconds = Math.floor((expiresAt.getTime() - currentTime.getTime()) / 1000);
  const hoursLeft = Math.floor(distanceInSeconds / 60 / 60);
  const minutesLeft = Math.floor(distanceInSeconds / 60) - hoursLeft * 60;
  const secondsLeft = distanceInSeconds - hoursLeft * 60 * 60 - minutesLeft * 60;

  const hoursLeftStr = `${hoursLeft.toString().padStart(2, '0')}h`;
  const minutesLeftStr = `${minutesLeft.toString().padStart(2, '0')}m`;
  const secondsLeftStr = `${secondsLeft.toString().padStart(2, '0')}s`;

  if (hoursLeft > 0) {
    return `${hoursLeftStr}:${minutesLeftStr}:${secondsLeftStr}`;
  }

  if (minutesLeft > 0) {
    return `${minutesLeftStr}:${secondsLeftStr}`;
  }

  return `${secondsLeftStr}`;
}