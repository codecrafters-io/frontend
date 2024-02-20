import { Factory, trait } from 'miragejs';
import createCourseExtensionActivations from '../utils/create-course-extension-activations';
import syncRepositoryStageLists from '../utils/sync-repository-stage-lists';

export default Factory.extend({
  createdAt: () => new Date(),
  cloneUrl: 'https://git.codecrafters.io/a-long-test-string.git',
  name: 'Dummy name',

  afterCreate(repository, server) {
    createCourseExtensionActivations(server, repository);
    syncRepositoryStageLists(server, repository);
  },

  withFirstStageInProgress: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withFailureStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position')[0],
        createdAt: repository.createdAt,
        status: 'failure',
      });
      server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position')[0],
        createdAt: new Date(repository.createdAt.getTime() + 1000), // 1s
        status: 'evaluating',
      });
    },
  }),

  withBaseStagesCompleted: trait({
    afterCreate(repository, server) {
      repository.course.stages.models.forEach((stage) => {
        if (stage.primaryExtensionSlug) {
          return; // Not a base stage
        }

        server.create('submission', 'withSuccessStatus', {
          repository,
          courseStage: stage,
          createdAt: repository.createdAt, // 1s
        });
      });
    },
  }),

  withAllStagesCompleted: trait({
    afterCreate(repository, server) {
      repository.course.stages.models.forEach((stage) => {
        server.create('submission', 'withSuccessStatus', {
          repository,
          courseStage: stage,
          createdAt: repository.createdAt, // 1s
        });
      });
    },
  }),

  withFirstStageCompleted: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withFailureStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position')[0],
        createdAt: repository.createdAt,
        status: 'failure',
      });
      server.create('submission', 'withSuccessStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position')[0],
        createdAt: new Date(repository.createdAt.getTime() + 1000), // 1s
      });
    },
  }),

  withSetupStageCompleted: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withFailureStatus', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position')[0],
        createdAt: repository.createdAt,
        status: 'failure',
      });
    },
  }),
});
