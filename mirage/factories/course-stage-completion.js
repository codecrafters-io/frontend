import { Factory } from 'miragejs';

export default Factory.extend({
  afterCreate(courseStageCompletion, server) {
    let leaderboardEntry = server.schema.leaderboardEntries.findOrCreateBy({
      userId: courseStageCompletion.repository.user.id,
      languageId: courseStageCompletion.repository.language.id,
    });

    let completedStagePosition = courseStageCompletion.courseStage.position;
    let nextStage = courseStageCompletion.repository.course.stages.models.find((x) => x.position === completedStagePosition + 1);

    leaderboardEntry.update({ lastAttemptAt: courseStageCompletion.completedAt, currentCourseStage: nextStage || courseStageCompletion.courseStage });
  },
});
