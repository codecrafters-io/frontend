import { Factory, trait } from 'miragejs';

export default Factory.extend({
  createdAt: () => new Date(),
  cloneUrl: 'https://git.codecraters.io/a-long-test-string.git',
  name: 'Dummy name',
  starterRepositoryUrl: 'https://github.com/codecrafters-io/redis-starter-go',

  withFirstStageInProgress: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withFailureStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: repository.createdAt,
        status: 'failure',
      });
      server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: new Date(repository.createdAt.getTime() + 1000), // 1s
        status: 'evaluating',
      });
    },
  }),

  withFirstStageCompleted: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withFailureStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: repository.createdAt,
        status: 'failure',
      });
      server.create('submission', 'withSuccessStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: new Date(repository.createdAt.getTime() + 1000), // 1s
      });
    },
  }),

  withSetupStageCompleted: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withFailureStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: repository.createdAt,
        status: 'failure',
      });
    },
  }),
});
