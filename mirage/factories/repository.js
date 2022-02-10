import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  createdAt: () => new Date(),
  cloneUrl: 'https://git.codecraters.io/a-long-test-string.git',
  name: 'Dummy name',
  starterRepositoryUrl: 'https://github.com/codecrafters-io/redis-starter-go',

  withFirstStageInProgress: trait({
    afterCreate(repository, server) {
      server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: repository.createdAt,
        status: 'evaluating',
      });
    },
  }),

  withFirstStageCompleted: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withSuccessStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: repository.createdAt,
      });
    },
  }),
});
