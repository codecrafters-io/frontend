export default function (server) {
  server.get('/leaderboard-rank-calculations', function (schema, request) {
    if (!request.queryParams.leaderboard_id) {
      throw new Error('No leaderboard ID provided');
    }

    return schema.leaderboardRankCalculations.all().filter((calculation) => calculation.leaderboard.id === request.queryParams.leaderboard_id);
  });

  server.post('/leaderboard-rank-calculations', function (schema, request) {
    const attrs = this.normalizedRequestAttrs();
    attrs.calculatedAt = new Date();
    attrs.rank = 37812;

    return schema.leaderboardRankCalculations.create(attrs);
  });
}
