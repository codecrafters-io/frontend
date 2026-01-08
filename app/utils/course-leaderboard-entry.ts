// Same as the ember model, to avoid creating fake models
import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

export type CourseLeaderboardEntryStatus = 'evaluating' | 'completed' | 'idle';

interface CourseLeaderboardEntryArgs {
  status: CourseLeaderboardEntryStatus;
  completedStageSlugs?: string[];
  currentCourseStage: CourseStageModel;
  language: LanguageModel;
  user: UserModel;
  lastAttemptAt: Date;
}

export default class CourseLeaderboardEntry {
  declare status: CourseLeaderboardEntryStatus;
  declare completedStageSlugs: string[];
  declare currentCourseStage: CourseStageModel;
  declare language: LanguageModel;
  declare user: UserModel;
  declare lastAttemptAt: Date;

  constructor({ status, completedStageSlugs = [], currentCourseStage, language, user, lastAttemptAt }: CourseLeaderboardEntryArgs) {
    this.status = status;
    this.completedStageSlugs = completedStageSlugs;
    this.currentCourseStage = currentCourseStage;
    this.language = language;
    this.user = user;
    this.lastAttemptAt = lastAttemptAt;
  }

  get completedStagesCount(): number {
    return this.completedStageSlugs.length;
  }

  get course(): CourseModel {
    return this.currentCourseStage.course;
  }

  get statusIsCompleted(): boolean {
    return this.status === 'completed';
  }

  get statusIsEvaluating(): boolean {
    return this.status === 'evaluating';
  }

  get statusIsIdle(): boolean {
    return this.status === 'idle';
  }

  get userId(): string {
    return this.user.id;
  }
}
