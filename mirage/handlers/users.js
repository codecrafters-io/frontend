import { Response } from 'miragejs';
import CurrentMirageUser from 'codecrafters-frontend/mirage/utils/current-mirage-user';

export default function (server) {
  server.get('/users', function (schema, request) {
    return schema.users.where({ username: request.queryParams.username });
  });

  server.get('/users/current', function (schema) {
    const session = schema.sessions.find('current-session-id');

    if (session) {
      return session.user;
    } else {
      return new Response(200, {}, { data: {} });
    }
  });

  server.get('/users/:id');

  server.get('/users/:id/next-invoice-preview', function (schema) {
    return schema.invoices.create({
      createdAt: new Date(2025, 1, 1),
      amountDue: 7900,
      lineItems: [{ amount: 7900, amount_after_discounts: 7900, quantity: 1 }],
    });
  });

  server.get('/users/:id/top-language-leaderboard-slugs', function (schema) {
    if (!CurrentMirageUser.currentUserId) {
      return [];
    }

    const languageLeaderboardIds = schema.languages
      .all()
      .models.map((language) => language.leaderboard?.id)
      .filter(Boolean);

    return schema.leaderboardEntries
      .all()
      .models.filter((leaderboardEntry) => languageLeaderboardIds.includes(leaderboardEntry.leaderboard.id))
      .filter((leaderboardEntry) => leaderboardEntry.user.id === CurrentMirageUser.currentUserId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.leaderboard.language.slug);
  });

  server.post('/users/:id/sync-username-from-github', function (schema, request) {
    let user = schema.users.find(request.params.id);
    user.update({ username: 'updated-username' });

    return user;
  });

  server.patch('/users/:id', function (schema, request) {
    const { id } = request.params;
    const attrs = this.normalizedRequestAttrs();
    var username = attrs.username;
    var avatarUrl = attrs.avatarUrl;

    if (attrs.hasAnonymousModeEnabled) {
      username = 'Anonymous';
      avatarUrl = 'https://avatars.githubusercontent.com/u/59389854';
    } else {
      if (username === 'Anonymous') {
        username = attrs.githubUsername;
        avatarUrl = 'https://github.com/rohitpaulk.png';
      }
    }

    const user = schema.users.find(id);
    user.update({ username, avatarUrl });

    return user;
  });

  server.delete('/users/:id');
}
