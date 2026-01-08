import type CourseModel from 'codecrafters-frontend/models/course';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type UserModel from 'codecrafters-frontend/models/user';

type Status = 'completed' | 'evaluating' | 'idle';

interface CourseLeaderboardEntryArgs {
  status: Status;
  completedStageSlugs: string[];
  currentCourseStage: CourseStageModel | undefined;
  language: LanguageModel | undefined;
  user: UserModel;
  lastAttemptAt: Date;
}

// Same as the ember model, to avoid creating fake models
export default class CourseLeaderboardEntry {
  status: Status;
  completedStageSlugs: string[];
  currentCourseStage: CourseStageModel | undefined;
  language: LanguageModel | undefined;
  user: UserModel;
  lastAttemptAt: Date;

  constructor({ status, completedStageSlugs, currentCourseStage, language, user, lastAttemptAt }: CourseLeaderboardEntryArgs) {
    this.status = status;
    this.completedStageSlugs = completedStageSlugs || [];
    this.currentCourseStage = currentCourseStage;
    this.language = language;
    this.user = user;
    this.lastAttemptAt = lastAttemptAt;
  }

  get completedStagesCount(): number {
    return this.completedStageSlugs.length;
  }

  get course(): CourseModel | undefined {
    return this.currentCourseStage?.course;
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
