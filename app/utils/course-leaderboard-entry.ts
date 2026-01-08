import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

export default class CourseLeaderboardEntry {
  status: 'evaluating' | 'completed' | 'idle';
  completedStageSlugs: string[];
  currentCourseStage: CourseStageModel;
  language: LanguageModel;
  user: UserModel;
  lastAttemptAt: Date;

  constructor({
    status,
    completedStageSlugs,
    currentCourseStage,
    language,
    user,
    lastAttemptAt,
  }: {
    status: 'evaluating' | 'completed' | 'idle';
    completedStageSlugs?: string[];
    currentCourseStage: CourseStageModel;
    language: LanguageModel;
    user: UserModel;
    lastAttemptAt: Date;
  }) {
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
