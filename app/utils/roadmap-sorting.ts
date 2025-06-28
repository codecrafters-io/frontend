import seedrandom from 'seedrandom';

export function getRoughWeekSeed(date: number): number {
  const now = date;
  const weekMs = 7 * 24 * 60 * 60 * 1000; // milliseconds per week

  return now - (now % weekMs);
}

export function getReverseSortPositionForRoadmapPage(
  developmentStatus: string,
  votesCount: number,
  id: string,
  isAuthenticated: boolean,
  date: number,
  currentUserUsername?: string,
): string {
  const reverseSortPositionFromDevelopmentStatus = {
    in_progress: 3,
    not_started: 2,
    released: 1,
  }[developmentStatus];

  if (isAuthenticated && currentUserUsername) {
    // For authenticated users: fixed order per user per week
    const weekSeed = getRoughWeekSeed(date);
    const userWeekSeed = `${currentUserUsername}-${weekSeed}`;

    if (developmentStatus === 'in_progress') {
      // In progress: sort by vote count descending
      // Invert vote count by subtracting from a large number to get descending order
      const paddedVoteCount = votesCount.toString().padStart(10, '0');

      return `${reverseSortPositionFromDevelopmentStatus}-${paddedVoteCount}`;
    } else if (developmentStatus === 'not_started') {
      // Not started: sort by random but fixed per user per week
      // Add delimiter to prevent seed collision
      const rng = seedrandom(`${userWeekSeed}-${id}`);
      const randomSeed = Math.floor(rng() * 1000000); // Generate a number between 0-999999
      const paddedRandomSeed = randomSeed.toString().padStart(10, '0');

      return `${reverseSortPositionFromDevelopmentStatus}-${paddedRandomSeed}`;
    } else {
      // Released: sort by vote count descending
      // Invert vote count by subtracting from a large number to get descending order
      const paddedVoteCount = votesCount.toString().padStart(10, '0');

      return `${reverseSortPositionFromDevelopmentStatus}-${paddedVoteCount}`;
    }
  }

  // For unauthenticated users: sort by vote count descending for all statuses
  // Invert vote count by subtracting from a large number to get descending order
  const paddedVoteCount = votesCount.toString().padStart(10, '0');

  return `${reverseSortPositionFromDevelopmentStatus}-${paddedVoteCount}`;
}
