import CurrentMirageUser from 'codecrafters-frontend/mirage/utils/current-mirage-user';

export default function (server) {
  server.get('/leaderboard-entries', function (schema, request) {
    if (!request.queryParams.leaderboard_id) {
      throw new Error('No leaderboard ID provided');
    }

    const leaderboardEntries = schema.leaderboardEntries
      .all()
      .filter((leaderboardEntry) => leaderboardEntry.leaderboard.id === request.queryParams.leaderboard_id)
      .sort((a, b) => b.score - a.score);

    if (!request.queryParams.filter_type || request.queryParams.filter_type === 'top') {
      return leaderboardEntries.slice(0, 10);
    } else if (request.queryParams.filter_type === 'around_me') {
      if (!request.queryParams.user_id) {
        throw new Error('No user ID provided for around_me filter type');
      }

      const userEntry = leaderboardEntries.filter((leaderboardEntry) => leaderboardEntry.user.id === request.queryParams.user_id).models[0];

      if (!userEntry) {
        // TODO: Check why this.serialize([]) doesn't work!
        return { data: [] };
      }

      const userEntryIndex = leaderboardEntries.models.indexOf(userEntry);

      return leaderboardEntries.slice(userEntryIndex - 3, userEntryIndex + 4);
    } else {
      throw new Error(`Invalid filter type: ${request.queryParams.filter_type}`);
    }
  });
}
