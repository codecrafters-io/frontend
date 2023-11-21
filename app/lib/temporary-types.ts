// TypeScript file for temporary types until we migrate all models to TS
import { SectionList as PreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseExtensionActivationModel from 'codecrafters-frontend/models/course-extension-activation';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';
import CourseStageScreencastModel from 'codecrafters-frontend/models/course-stage-screencast';
import BuildpackModel from 'codecrafters-frontend/models/buildpack';
import BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import CourseStageLanguageGuideModel from 'codecrafters-frontend/models/course-stage-language-guide';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import TeamModel from 'codecrafters-frontend/models/team';

export class TemporaryUserModel {
  declare avatarUrl: string;
  declare badgeAwards: BadgeAwardModel[];
  declare canAccessPaidContent: boolean;
  declare codecraftersProfileUrl: string;
  declare earlyBirdDiscountEligibilityExpiresAt: Date;
  declare featureSuggestions: unknown[];
  declare githubProfileUrl: string;
  declare hasActiveFreeUsageGrants: boolean;
  declare hasJoinedReferralProgram: boolean;
  declare id: string;
  declare isConceptAuthor: boolean;
  declare isEligibleForEarlyBirdDiscount: boolean;
  declare isStaff: boolean;
  declare isTeamMember: boolean;
  declare lastFreeUsageGrantExpiresAt: Date | null;
  declare primaryEmailAddress: string;
  declare referralLinks: ReferralLinkModel[];
  declare username: string;
  declare teams: TeamModel[];

  declare fetchCurrent: (this: TemporaryUserModel, payload: unknown) => Promise<TemporaryUserModel | null>;

  canAttemptCourseStage(_courseStage: TemporaryCourseStageModel): boolean {
    return false;
  }

  isCourseAuthor(_course: TemporaryCourseModel): boolean {
    return false;
  }
}

export class TemporaryCourseModel {
  declare baseStages: TemporaryCourseStageModel[];
  declare betaOrLiveLanguages: TemporaryLanguageModel[];
  declare buildpacks: BuildpackModel[];
  declare buildpacksLastSyncedAt: Date | null;
  declare definitionRepositoryFullName: string;
  declare definitionRepositoryLink: string;
  declare extensions: CourseExtensionModel[];
  declare firstStage: TemporaryCourseStageModel | null;
  declare hasExtensions: boolean;
  declare id: string;
  declare name?: string;
  declare primaryExtensionSlug: string | null;
  declare releaseStatusIsBeta: boolean;
  declare secondaryExtensionSlugs: string[];
  declare slug: string;
  declare sortedBaseStages: TemporaryCourseStageModel[];
  declare stages: TemporaryCourseStageModel[];
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
  declare hasCommunitySolutionsForLanguage: (language: TemporaryLanguageModel) => boolean;
}

export class TemporaryLanguageModel {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare grayLogoUrl: string;
  declare tealLogoUrl: string;
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
  declare createdAt: Date | null;
  declare expectedActivityFrequency: 'every_day' | 'once_a_week' | 'multiple_times_a_week';
  declare id: null | string;
  declare isNew: boolean;
  declare isSaving: boolean;
  declare language: undefined | TemporaryLanguageModel;
  declare languageProficiencyLevel: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  declare lastSubmissionAt: Date | null;
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
