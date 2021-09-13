import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  afterCreate(courseStageCompletion, server) {
    let leaderboardEntry = server.schema.leaderboardEntries.findOrCreateBy({
      userId: courseStageCompletion.repository.user.id,
      languageId: courseStageCompletion.repository.language.id,
    });

    leaderboardEntry.update({ activeCourseStage: courseStageCompletion.courseStage, hasActiveSubmission: false });
  },
});
