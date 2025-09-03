export default function (server) {
  server.get('/leaderboard-entries', function (schema, request) {
    if (!request.queryParams.leaderboard_id) {
      throw new Error('No leaderboard ID provided');
    }

    return schema.leaderboardEntries.all().filter((leaderboardEntry) => leaderboardEntry.leaderboard.id === request.queryParams.leaderboard_id);
  });
}
