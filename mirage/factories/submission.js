import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  afterCreate(submission, server) {
    let leaderboardEntry = server.schema.leaderboardEntries.findOrCreateBy({
      userId: submission.repository.user.id,
      languageId: submission.repository.language.id,
    });

    console.log(leaderboardEntry.id);

    leaderboardEntry.update({ activeCourseStage: submission.courseStage, hasActiveSubmission: true });
  },
});
