// TypeScript file for temporary types until we migrate all models to TS
import { SectionList as PreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';
import CourseExtensionModel from 'codecrafters-frontend/models/course-extension';
import CourseExtensionActivationModel from 'codecrafters-frontend/models/course-extension-activation';

export class TemporaryUserModel {
  declare id: string;
  declare username: string;
  declare badgeAwards: unknown[];
}

export class TemporaryCourseModel {
  declare id: string;
  declare name?: string;
  declare slug: string;
  declare extensions: CourseExtensionModel[];
  declare releaseStatusIsBeta: boolean;
}

export class TemporaryCourseStageModel {
  declare id: string;
  declare slug: string;
  declare course: TemporaryCourseModel;
  declare descriptionMarkdownTemplate: string;
  declare isFirst: boolean;
}

export class TemporaryLanguageModel {
  declare id: string;
  declare name: string;
  declare slug: string;
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
  declare remindersAreEnabled: boolean | null;
  declare user: TemporaryUserModel;

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
