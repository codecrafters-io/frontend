import { Factory, trait } from 'miragejs';

export default Factory.extend({
  changedFiles: () => {
    return [
      {
        filename: 'README.md',
        diff: `This is the README.md file.

- and this was removed!
+ and this was added!
          `,
      },
      {
        filename: 'server.rb',
        diff: `    end

    def listen
      loop do
        client = @server.accept
+       handle_client(client)
+     end
+   end
+
+   def handle_client(client)
+     loop do
+       client.gets
+
        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
      end
    end
  end`,
      },
    ];
  },

  createdAt: () => new Date(),
  githubStorageHtmlUrl: 'https://github.com',

  withFailureStatus: trait({
    status: 'failure',

    afterCreate(submission, server) {
      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(submission.createdAt.getTime() + 11290), // 11.29s
        logsBase64: btoa('\x1b[91m[stage-1] failure\x1b[0m\n\x1b[91m[stage-2] failure\x1b[0m'),
      });
    },
  }),

  withSuccessStatus: trait({
    status: 'success',

    afterCreate(submission, server) {
      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(submission.createdAt.getTime() + 4219), // 4.219s
        logsBase64: btoa('\x1b[92m[stage-1] passed\x1b[0m\n[stage-2] passed'),
      });

      server.create('course-stage-completion', {
        repository: submission.repository,
        courseStage: submission.courseStage,
        completedAt: submission.createdAt,
      });
    },
  }),

  withEvaluatingStatus: trait({
    status: 'evaluating',
  }),

  afterCreate(submission) {
    submission.repository.update('lastSubmission', submission);
  },
});
