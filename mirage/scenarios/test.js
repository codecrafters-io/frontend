export default function (server) {
  let python = server.create('language', { name: 'Python' });
  let go = server.create('language', { name: 'Go' });

  server.create('course', {
    difficulty: 'medium',
    name: 'Build Your Own Redis',
    slug: 'redis',
    descriptionMarkdown: 'This is the Redis challenge',
    shortDescriptionMarkdown: 'This is the Redis challenge. You will learn stuff in this challenge',
    supportedLanguages: [python, go],
  });

  server.create('course', {
    difficulty: 'medium',
    name: 'Build Your Own Docker',
    slug: 'docker',
    descriptionMarkdown: 'This is the Docker challenge',
    shortDescriptionMarkdown: 'This is the Docker challenge. You will learn stuff in this challenge',
  });

  server.create('course', {
    difficulty: 'hard',
    name: 'Build Your Own Git',
    slug: 'git',
    descriptionMarkdown: 'This is the Git challenge',
    shortDescriptionMarkdown: 'This is the Git challenge. You will learn stuff in this challenge',
  });
}
