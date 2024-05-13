import { Factory } from 'miragejs';
import syncRepositoryStageLists from '../utils/sync-repository-stage-lists';

export default Factory.extend({
  completedAt: () => new Date(),

  afterCreate(courseStageCompletion, server) {
    let leaderboardEntry = server.schema.courseLeaderboardEntries.findOrCreateBy({
      userId: courseStageCompletion.repository.user.id,
      languageId: courseStageCompletion.repository.language.id,
    });

    let completedStagePosition = courseStageCompletion.courseStage.position;
    let nextStage = courseStageCompletion.repository.course.stages.models.find((x) => x.position === completedStagePosition + 1);

    let completedStageSlugs = courseStageCompletion.repository.courseStageCompletions.models
      .map((model) => model.courseStage.slug)
      .filter((slug, index, array) => array.indexOf(slug) === index);

    leaderboardEntry.update({
      lastAttemptAt: courseStageCompletion.completedAt,
      currentCourseStage: nextStage || courseStageCompletion.courseStage,
      status: nextStage ? 'idle' : 'completed',
      completedStageSlugs: completedStageSlugs,
    });

    syncRepositoryStageLists(server, courseStageCompletion.repository);
  },
});
