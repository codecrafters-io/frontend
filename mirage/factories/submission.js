import { Factory, trait } from 'miragejs';

export default Factory.extend({
  createdAt: () => new Date(),
  githubStorageHtmlUrl: 'https://github.com',

  withFailureStatus: trait({
    status: 'failure',

    afterCreate(submission, server) {
      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(submission.createdAt.getTime() + 11290), // 11.29s
        logs: '[stage-1] failure\n[stage-2] failure',
      });
    },
  }),

  withSuccessStatus: trait({
    status: 'success',

    afterCreate(submission, server) {
      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(submission.createdAt.getTime() + 4219), // 4.219s
        logs: '\\033[92m[stage-1] passed\\033[0m\n[stage-2] passed',
      });

      server.create('course-stage-completion', {
        repository: submission.repository,
        courseStage: submission.courseStage,
        completedAt: submission.createdAt,
      });
    },
  }),

  afterCreate(submission) {
    submission.repository.update('lastSubmission', submission);
  },
});
