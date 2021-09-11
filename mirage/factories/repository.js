import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  cloneUrl: 'git://test.com',
  name: 'Dummy name',

  withFirstStageInProgress: trait({
    afterCreate(repository, server) {
      let submission = server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: new Date(),
      });

      repository.update('lastSubmission', submission);
    },
  }),

  withFirstStageCompleted: trait({
    afterCreate(repository, server) {
      let submission = server.create('submission', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        createdAt: new Date(),
      });

      server.create('course-stage-completion', {
        repository,
        courseStage: repository.course.stages.models.sortBy('position').firstObject,
        completedAt: new Date(),
      });

      repository.update('lastSubmission', submission);
    },
  }),
});
