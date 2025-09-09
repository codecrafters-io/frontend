export default function (server) {
  server.get('/leaderboard-rank-calculations', function (schema, request) {
    if (!request.queryParams.leaderboard_id) {
      throw new Error('No leaderboard ID provided');
    }

    return schema.leaderboardRankCalculations.all().filter((calculation) => calculation.leaderboard.id === request.queryParams.leaderboard_id);
  });

  server.post('/leaderboard-rank-calculations', function (schema) {
    const attrs = this.normalizedRequestAttrs();
    const leaderboard = schema.leaderboards.find(attrs.leaderboardId);
    const user = schema.users.find(attrs.userId);

    if (!leaderboard) {
      throw new Error('Leaderboard not found');
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (!leaderboard.entries.models.find((entry) => entry.user.id === user.id)) {
      throw new Error('User does not have a leaderboard entry');
    }

    attrs.calculatedAt = new Date();
    attrs.rank = 37812;

    return schema.leaderboardRankCalculations.create(attrs);
  });
}
