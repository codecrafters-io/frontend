// Same as the ember model, to avoid creating fake models
export default class CourseLeaderboardEntry {
  status;
  completedStageSlugs;
  currentCourseStage;
  language;
  user;
  lastAttemptAt;

  constructor({ status, completedStageSlugs, currentCourseStage, language, user, lastAttemptAt }) {
    this.status = status;
    this.completedStageSlugs = completedStageSlugs || [];
    this.currentCourseStage = currentCourseStage;
    this.language = language;
    this.user = user;
    this.lastAttemptAt = lastAttemptAt;
  }

  get completedStagesCount() {
    return this.completedStageSlugs.length;
  }

  get course() {
    return this.currentCourseStage.course;
  }

  get statusIsCompleted() {
    return this.status === 'completed';
  }

  get statusIsEvaluating() {
    return this.status === 'evaluating';
  }

  get statusIsIdle() {
    return this.status === 'idle';
  }

  get userId() {
    return this.user.id;
  }
}
