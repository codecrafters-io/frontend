function findOrCreateUser(server, username, attrs = {}) {
  return (
    server.schema.users.findBy({ username }) ||
    server.create('user', { username, githubUsername: username, avatarUrl: `https://github.com/${username}.png`, createdAt: new Date(), ...attrs })
  );
}

export default function createLanguageLeaderboardEntries(server, languageSlug) {
  const language = server.schema.languages.findBy({ slug: languageSlug });
  const leaderboard = language.leaderboard || server.create('leaderboard', { language });

  const user1 = findOrCreateUser(server, 'Gufran');
  const user2 = findOrCreateUser(server, 'rohitpaulk');
  const user3 = findOrCreateUser(server, 'sarupbanskota');

  [user1, user2, user3].forEach((user) => {
    server.create('leaderboard-entry', {
      leaderboard,
      user,
      score: user === user1 ? 4 : 2,
    });
  });
}
