import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  afterCreate(courseStageCompletion, server) {
    console.log('afterCreate ran');
    server.create('leaderboard-entry', {
      highestCompletedCourseStage: courseStageCompletion.courseStage,
      language: courseStageCompletion.repository.language,
      user: courseStageCompletion.repository.user,
      hasActiveSubmission: false,
    });
  },
});
