export default function (server) {
  server.get('/leaderboard-entries', function (schema, request) {
    let result = schema.leaderboardEntries.all();

    if (!request.queryParams.leaderboard_id) {
      throw new Error('No leaderboard ID provided');
    }

    result = result.filter((leaderboardEntry) => leaderboardEntry.leaderboard.id === request.queryParams.leaderboard_id);

    return result;
  });
}
