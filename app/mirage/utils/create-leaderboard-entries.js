export default function createLeaderboardEntries(server, languageSlug, courseSlug) {
  // eslint-disable-next-line ember/no-array-prototype-extensions
  let language = server.schema.languages.findBy({ slug: languageSlug });
  // eslint-disable-next-line ember/no-array-prototype-extensions
  let course = server.schema.courses.findBy({ slug: courseSlug });

  let user1 = server.create('user', {
    id: 'user1',
    avatarUrl: 'https://github.com/Gufran.png',
    createdAt: new Date(),
    githubUsername: 'Gufran',
    username: 'Gufran',
  });

  let user2 = server.create('user', {
    id: 'user2',
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
    server.create('course-leaderboard-entry', {
      status: 'idle',
      currentCourseStage: course.stages.models.find((x) => x.position === 2),
      language: language,
      user: user,
      lastAttemptAt: new Date(),
    });
  });
}
