// TypeScript file for temporary types until we migrate all models to TS
import { SectionList as PreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseExtensionActivationModel from 'codecrafters-frontend/models/course-extension-activation';
import RepositoryStageListModel from 'codecrafters-frontend/models/repository-stage-list';
import UserModel from 'codecrafters-frontend/models/user';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';

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
  declare courseStage: CourseStageModel;
  declare createdAt: Date;
  declare repository: TemporaryRepositoryModel;
}

export class TemporaryRepositoryModel {
  declare allStagesAreComplete: boolean;
  declare baseStagesAreComplete: boolean;
  declare course: CourseModel;
  declare courseExtensionActivations: CourseExtensionActivationModel[];
  declare currentStage: CourseStageModel | null;
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
  declare user: UserModel;
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

  get highestCompletedStage(): CourseStageModel | null {
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

  hasClosedCourseStageFeedbackSubmissionFor(_stage: CourseStageModel) {
    return false;
  }

  save(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}
