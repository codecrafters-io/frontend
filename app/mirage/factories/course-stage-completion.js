import { Factory } from 'miragejs';
import syncRepositoryStageLists from '../utils/sync-repository-stage-lists';

export default Factory.extend({
  completedAt: () => new Date(),

  afterCreate(courseStageCompletion, server) {
    let courseLeaderboardEntry = server.schema.courseLeaderboardEntries.findOrCreateBy({
      userId: courseStageCompletion.repository.user.id,
      languageId: courseStageCompletion.repository.language.id,
    });

    let completedStagePosition = courseStageCompletion.courseStage.position;
    let nextStage = courseStageCompletion.repository.course.stages.models.find((x) => x.position === completedStagePosition + 1);

    let completedStageSlugs = courseStageCompletion.repository.courseStageCompletions.models
      .map((model) => model.courseStage.slug)
      .filter((slug, index, array) => array.indexOf(slug) === index);

    courseLeaderboardEntry.update({
      lastAttemptAt: courseStageCompletion.completedAt,
      currentCourseStage: nextStage || courseStageCompletion.courseStage,
      status: nextStage ? 'idle' : 'completed',
      completedStageSlugs: completedStageSlugs,
    });

    // Also create/update the track leaderboard entry (language leaderboard)
    const language = courseStageCompletion.repository.language;
    const languageLeaderboard = language.leaderboard;

    if (languageLeaderboard) {
      const user = courseStageCompletion.repository.user;
      let trackLeaderboardEntry = server.schema.leaderboardEntries
        .all()
        .models.find((entry) => entry.user.id === user.id && entry.leaderboard.id === languageLeaderboard.id);

      if (!trackLeaderboardEntry) {
        server.create('leaderboard-entry', {
          leaderboard: languageLeaderboard,
          user: user,
          score: 1,
          isBanned: false,
        });
      } else {
        trackLeaderboardEntry.update({
          score: trackLeaderboardEntry.score + 1,
        });
      }
    }

    syncRepositoryStageLists(server, courseStageCompletion.repository);
  },
});
