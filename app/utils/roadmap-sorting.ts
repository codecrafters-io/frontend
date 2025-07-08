import seedrandom from 'seedrandom';

export function getRoughWeekSeed(date: number): number {
  const weekMs = 7 * 24 * 60 * 60 * 1000; // milliseconds per week

  return date - (date % weekMs);
}

export function getSortPositionForRoadmapPage(
  developmentStatus: string,
  votesCount: number,
  id: string,
  date: number,
  currentUserId?: string | null,
): string {
  const statusSortKey =
    {
      in_progress: 1,
      not_started: 2,
      released: 3,
    }[developmentStatus] ?? 4; // Default to lowest priority if status is unknown

  const sortKeys: string[] = [statusSortKey.toString()];

  // Special case: logged-in user and not_started
  if (currentUserId && developmentStatus === 'not_started') {
    // Not started: sort by random but fixed per user per week
    const weekSeed = getRoughWeekSeed(date);
    const userWeekSeed = `${currentUserId}-${weekSeed}`;
    const rng = seedrandom(`${userWeekSeed}-${id}`);
    const randomSeed = Math.floor(rng() * 1000000); // Generate a number between 0-999999
    const paddedRandomSeed = randomSeed.toString().padStart(10, '0');
    sortKeys.push(paddedRandomSeed);
  } else {
    // All other cases: sort by vote count descending (highest votes first)
    const invertedVoteCountKey = (999999999 - votesCount).toString().padStart(10, '0');
    sortKeys.push(invertedVoteCountKey);
  }

  return sortKeys.join('-');
}
