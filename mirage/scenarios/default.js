export default function (server) {
  const python = server.create('language', { name: 'Python' });
  const go = server.create('language', { name: 'Go' });

  const redis = server.create('course', {
    difficulty: 'medium',
    name: 'Build Your Own Redis',
    slug: 'redis',
    descriptionMarkdown: 'This is the Redis challenge',
    shortDescriptionMarkdown: 'This is the Redis challenge. You will learn stuff in this challenge',
    supportedLanguages: [python, go],
  });

  server.create('course-stage', {
    course: redis,
    name: 'Bind to a port',
    position: 1,
    descriptionMarkdownTemplate: `
Let's start out with some basics.

In this stage, CodeCrafters will try to bind to port 6379, which is the default
port that Redis uses.

Your task is to start a TCP server on port 6379. We'd like to make the first
stage easy to pass, so we've included steps on how to pass this stage in the
readme.`,
  });

  server.create('course-stage', {
    course: redis,
    name: 'Respond to PING',
    position: 2,
    descriptionMarkdownTemplate: 'This is a test description',
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
