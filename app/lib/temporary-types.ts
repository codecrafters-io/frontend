// TypeScript file for temporary types until we migrate all models to TS
import { SectionList as PreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseExtensionActivationModel from 'codecrafters-frontend/models/course-extension-activation';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';
import CourseStageScreencastModel from 'codecrafters-frontend/models/course-stage-screencast';
import BuildpackModel from 'codecrafters-frontend/models/buildpack';
import BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import CourseStageLanguageGuideModel from 'codecrafters-frontend/models/course-stage-language-guide';

export class TemporaryUserModel {
  declare id: string;
  declare username: string;
  declare badgeAwards: BadgeAwardModel[];
  declare avatarUrl: string;
  declare isConceptAuthor: boolean;
  declare isStaff: boolean;
  declare primaryEmailAddress: string;
  declare isEligibleForEarlyBirdDiscount: boolean;
  declare earlyBirdDiscountEligibilityExpiresAt: Date;
  declare canAccessPaidContent: boolean;
  declare githubProfileUrl: string;

  declare fetchCurrent: (this: TemporaryUserModel, payload: unknown) => Promise<TemporaryUserModel | null>;

  canAttemptCourseStage(_courseStage: TemporaryCourseStageModel): boolean {
    return false;
  }

  hasJoinedReferralProgram(): boolean {
    return false;
  }

  isCourseAuthor(_course: TemporaryCourseModel): boolean {
    return false;
  }
}

export class TemporaryCourseModel {
  declare definitionRepositoryLink: string;
  declare definitionRepositoryFullName: string;
  declare id: string;
  declare name?: string;
  declare slug: string;
  declare hasExtensions: boolean;
  declare extensions: CourseExtensionModel[];
  declare releaseStatusIsBeta: boolean;
  declare sortedBaseStages: TemporaryCourseStageModel[];
  declare primaryExtensionSlug: string | null;
  declare secondaryExtensionSlugs: string[];
  declare stages: TemporaryCourseStageModel[];
  declare baseStages: TemporaryCourseStageModel[];
  declare buildpacks: BuildpackModel[];
  declare buildpacksLastSyncedAt: Date | null;
  declare syncBuildpacks: () => Promise<Record<string, string>>;
}

export class TemporaryCourseStageModel {
  declare id: string;
  declare difficulty: 'very_easy' | 'easy' | 'medium' | 'hard';
  declare slug: string;
  declare course: TemporaryCourseModel;
  declare descriptionMarkdownTemplate: string;
  declare identifierForURL: string;
  declare isBaseStage: boolean;
  declare isFirst: boolean;
  declare isSecond: boolean;
  declare isThird: boolean;
  declare languageGuides: CourseStageLanguageGuideModel[];
  declare name: string;
  declare position: number;
  declare positionWithinExtension: number;
  declare positionWithinCourse: number;
  declare primaryExtensionSlug: string | null;
  declare secondaryExtensionSlugs: string[];
  declare primaryExtension: CourseExtensionModel | null;
  declare secondaryExtensions: CourseExtensionModel[];
  declare screencasts: CourseStageScreencastModel[];
  declare isExtensionStage: boolean;
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
  declare repository: TemporaryRepositoryModel;
}

export class TemporaryRepositoryModel {
  declare allStagesAreComplete: boolean;
  declare baseStagesAreComplete: boolean;
  declare course: TemporaryCourseModel;
  declare courseExtensionActivations: CourseExtensionActivationModel[];
  declare currentStage: TemporaryCourseStageModel | null;
  declare expectedActivityFrequency: 'every_day' | 'once_a_week' | 'multiple_times_a_week';
  declare id: null | string;
  declare isNew: boolean;
  declare isSaving: boolean;
  declare language: undefined | TemporaryLanguageModel;
  declare languageProficiencyLevel: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  declare preChallengeAssessmentSectionList: PreChallengeAssessmentSectionList;
  declare stageList: RepositoryStageListModel | null;
  declare remindersAreEnabled: boolean | null;
  declare user: TemporaryUserModel;
  declare lastSubmission: TemporarySubmissionModel | null;
  declare lastSubmissionIsEvaluating: boolean;
  declare lastSubmissionHasFailureStatus: boolean;

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

  get highestCompletedStage(): TemporaryCourseStageModel | null {
    return null;
  }

  get languageProficiencyLevelHumanized(): string {
    return 'dummy';
  }

  get languageProficiencyLevelMappings(): Record<TemporaryRepositoryModel['languageProficiencyLevel'], string> {
    return {
      never_tried: 'Never tried',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    };
  }

  hasClosedCourseStageFeedbackSubmissionFor(_stage: TemporaryCourseStageModel) {
    return false;
  }

  save(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}
