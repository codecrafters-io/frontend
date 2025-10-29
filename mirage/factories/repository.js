import { Factory, trait } from 'miragejs';
import createCourseExtensionActivations from '../utils/create-course-extension-activations';
import syncRepositoryStageLists from '../utils/sync-repository-stage-lists';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

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
        courseStage: repository.course.stages.models.toSorted(fieldComparator('position'))[0],
        createdAt: repository.createdAt,
        status: 'failure',
      });
      server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.toSorted(fieldComparator('position'))[0],
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

        server.create('submission', 'withStageCompletion', {
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
        server.create('submission', 'withStageCompletion', {
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
        courseStage: repository.course.stages.models.toSorted(fieldComparator('position'))[0],
        createdAt: repository.createdAt,
        status: 'failure',
      });
      server.create('submission', 'withStageCompletion', {
        repository,
        courseStage: repository.course.stages.models.toSorted(fieldComparator('position'))[0],
        createdAt: new Date(repository.createdAt.getTime() + 1000), // 1s
      });
    },
  }),

  withSecondStageCompleted: trait({
    afterCreate(repository, server) {
      const firstStage = repository.course.stages.models.toSorted(fieldComparator('position'))[0];
      const secondStage = repository.course.stages.models.toSorted(fieldComparator('position'))[1];

      [firstStage, secondStage].forEach((stage, index) => {
        server.create('submission', 'withFailureStatus', {
          repository,
          courseStage: stage,
          createdAt: new Date(repository.createdAt.getTime() + 1000 * index), // 1s, 2s
          status: 'failure',
        });

        server.create('submission', 'withStageCompletion', {
          repository,
          courseStage: stage,
          createdAt: new Date(repository.createdAt.getTime() + 1500 * (index + 1)), // 1.5s, 3s
        });
      });
    },
  }),

  withSetupStageCompleted: trait({
    afterCreate(repository, server) {
      server.create('submission', 'withFailureStatus', {
        repository,
        courseStage: repository.course.stages.models.toSorted(fieldComparator('position'))[0],
        createdAt: repository.createdAt,
        status: 'failure',
      });
    },
  }),
});
