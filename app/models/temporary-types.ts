// TypeScript file for temporary types until we migrate all models to TS
import { SectionList as PreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseExtensionActivationModel from 'codecrafters-frontend/models/course-extension-activation';
import RepositoryStageListModel from './repository-stage-list';
import CourseStageScreencastModel from './course-stage-screencast';

export class TemporaryUserModel {
  declare id: string;
  declare username: string;
  declare badgeAwards: unknown[];
  declare avatarUrl: string;
  declare isStaff: boolean;
  declare primaryEmailAddress: string;
  declare isEligibleForEarlyBirdDiscount: boolean;
  declare earlyBirdDiscountEligibilityExpiresAt: Date;
  declare canAccessPaidContent: boolean;

  declare fetchCurrent: (this: TemporaryUserModel, payload: unknown) => Promise<TemporaryUserModel | null>;

  isCourseAuthor(_course: TemporaryCourseModel): boolean {
    return false;
  }
}

export class TemporaryCourseModel {
  declare id: string;
  declare name?: string;
  declare slug: string;
  declare extensions: CourseExtensionModel[];
  declare releaseStatusIsBeta: boolean;
  declare sortedStages: TemporaryCourseStageModel[];
  declare sortedBaseStages: TemporaryCourseStageModel[];
  declare primaryExtensionSlug: string | null;
  declare secondaryExtensionSlugs: string[];
}

export class TemporaryCourseStageModel {
  declare id: string;
  declare slug: string;
  declare course: TemporaryCourseModel;
  declare descriptionMarkdownTemplate: string;
  declare identifierForURL: string;
  declare isBaseStage: boolean;
  declare isFirst: boolean;
  declare name: string;
  declare position: number;
  declare nextStage: TemporaryCourseStageModel | null;
  declare primaryExtensionSlug: string | null;
  declare secondaryExtensionSlugs: string[];
  declare primaryExtension: CourseExtensionModel | null;
  declare secondaryExtensions: CourseExtensionModel[];
  declare screencasts: CourseStageScreencastModel[];
}

export class TemporaryLanguageModel {
  declare id: string;
  declare name: string;
  declare slug: string;
}

export class TemporarySubmissionModel {
  declare id: string;
  declare status: 'evaluating' | 'failed' | 'success' | 'internal_error';
  declare courseStage: TemporaryCourseStageModel;
  declare createdAt: Date;
}

export class TemporaryRepositoryModel {
  declare course: TemporaryCourseModel;
  declare courseExtensionActivations: CourseExtensionActivationModel[];
  declare currentStage: TemporaryCourseStageModel | null;
  declare expectedActivityFrequency: 'every_day' | 'once_a_week' | 'multiple_times_a_week';
  declare id: null | string;
  declare isNew: boolean;
  declare isSaving: boolean;
  declare language: null | TemporaryLanguageModel;
  declare languageProficiencyLevel: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  declare preChallengeAssessmentSectionList: PreChallengeAssessmentSectionList;
  declare stageList: RepositoryStageListModel | null;
  declare remindersAreEnabled: boolean | null;
  declare user: TemporaryUserModel;
  declare lastSubmission: TemporarySubmissionModel | null;
  declare lastSubmissionIsEvaluating: boolean;
  declare lastSubmissionHasFailureStatus: boolean;

  hasClosedCourseStageFeedbackSubmissionFor(_stage: TemporaryCourseStageModel) {
    return false;
  }

  get highestCompletedStage(): TemporaryCourseStageModel | null {
    return null;
  }

  get activatedCourseExtensions(): CourseExtensionModel[] {
    return [];
  }

  get expectedActivityFrequencyHumanized(): string {
    return '';
  }

  get expectedActivityFrequencyMappings(): Record<TemporaryRepositoryModel['expectedActivityFrequency'], string> {
    return {
      every_day: 'Every day',
      once_a_week: 'Once a week',
      multiple_times_a_week: 'Multiple times a week',
    };
  }

  get languageProficiencyLevelMappings(): Record<TemporaryRepositoryModel['languageProficiencyLevel'], string> {
    return {
      never_tried: 'Never tried',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    };
  }

  get languageProficiencyLevelHumanized(): string {
    return 'dummy';
  }

  save(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}
