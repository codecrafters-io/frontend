import CurrentMirageUser from 'codecrafters-frontend/mirage/utils/current-mirage-user';

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
    const user = schema.users.find(CurrentMirageUser.currentUserId);

    if (!leaderboard) {
      throw new Error('Leaderboard not found');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    const userEntry = leaderboard.entries.models.find((entry) => entry.user.id === user.id);

    if (userEntry) {
      attrs.rank = leaderboard.entries.models.toSorted((a, b) => b.score - a.score).indexOf(userEntry) + 1;
    } else {
      attrs.rank = leaderboard.entries.models.length + 1;
    }

    attrs.calculatedAt = new Date();

    return schema.leaderboardRankCalculations.create(attrs);
  });
}
