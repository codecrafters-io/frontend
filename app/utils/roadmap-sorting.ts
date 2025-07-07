import seedrandom from 'seedrandom';

export function getRoughWeekSeed(date: number): number {
  const now = date;
  const weekMs = 7 * 24 * 60 * 60 * 1000; // milliseconds per week

  return now - (now % weekMs);
}

export function getSortPositionForRoadmapPage(
  developmentStatus: string,
  votesCount: number,
  id: string,
  date: number,
  currentUserId?: string | null,
): string {
  const statusPriority = {
    in_progress: 1,
    not_started: 2,
    released: 3,
  }[developmentStatus] ?? 4; // Default to lowest priority if status is unknown

  const sortKeys: string[] = [statusPriority.toString()];

  if (currentUserId) {
    // For authenticated users: fixed order per user per week
    const weekSeed = getRoughWeekSeed(date);
    const userWeekSeed = `${currentUserId}-${weekSeed}`;

    if (developmentStatus === 'in_progress') {
      // In progress: sort by vote count descending (highest votes first)
      const invertedVoteCount = (999999999 - votesCount).toString().padStart(10, '0');
      sortKeys.push(invertedVoteCount);
    } else if (developmentStatus === 'not_started') {
      // Not started: sort by random but fixed per user per week
      const rng = seedrandom(`${userWeekSeed}-${id}`);
      const randomSeed = Math.floor(rng() * 1000000); // Generate a number between 0-999999
      const paddedRandomSeed = randomSeed.toString().padStart(10, '0');
      sortKeys.push(paddedRandomSeed);
    } else {
      // Released: sort by vote count descending (highest votes first)
      const invertedVoteCount = (999999999 - votesCount).toString().padStart(10, '0');
      sortKeys.push(invertedVoteCount);
    }
  } else {
    // For unauthenticated users: sort by vote count descending for all statuses (highest votes first)
    const invertedVoteCount = (999999999 - votesCount).toString().padStart(10, '0');
    sortKeys.push(invertedVoteCount);
  }

  return sortKeys.join('-');
}
