import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  createdAt: () => new Date(),
  cloneUrl: 'git://test.com',
  name: 'Dummy name',
  starterRepositoryUrl: 'https://github.com/codecrafters-io/redis-starter-go',

  withFirstStageInProgress: trait({
    afterCreate(repository, server) {
      let submission = server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: new Date(),
        status: 'evaluating',
      });

      repository.update('lastSubmission', submission);
    },
  }),

  withFirstStageCompleted: trait({
    afterCreate(repository, server) {
      let submission = server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: repository.createdAt,
        status: 'success',
      });

      server.create('submission-evaluation', {
        submission,
        createdAt: new Date(),
        logs: '[stage-1] passed',
      });

      server.create('course-stage-completion', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        completedAt: repository.createdAt,
      });

      repository.update('lastSubmission', submission);
    },
  }),
});
