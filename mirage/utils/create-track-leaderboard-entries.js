export default function createTrackLeaderboardEntries(server, languageSlug) {
  let language = server.schema.languages.findBy({ slug: languageSlug });

  let user1 = server.create('user', {
    id: 'user1',
    avatarUrl: 'https://github.com/Gufran.png',
    createdAt: new Date(),
    githubUsername: 'Gufran',
    username: 'Gufran',
  });

  let user2 = server.create('user', {
    id: '63c51e91-e448-4ea9-821b-a80415f266d3',
    avatarUrl: 'https://github.com/rohitpaulk.png',
    createdAt: new Date(),
    githubUsername: 'rohitpaulk',
    username: 'rohitpaulk',
  });

  let user3 = server.create('user', {
    id: 'user3',
    avatarUrl: 'https://github.com/sarupbanskota.png',
    createdAt: new Date(),
    githubUsername: 'sarupbanskota',
    username: 'sarupbanskota',
  });

  [user1, user2, user3].forEach((user) => {
    server.create('track-leaderboard-entry', {
      language: language,
      user: user,
      completedStagesCount: user === user1 ? 4 : 2,
    });
  });
}
