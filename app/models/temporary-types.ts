// TypeScript file for temporary types until we migrate all models to TS
import { SectionList as PreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';

export class TemporaryCourseModel {
  declare id: string;
  declare name: string;
  declare slug: string;
}

export class TemporaryLanguageModel {
  declare id: string;
  declare name: string;
  declare slug: string;
}

export class TemporaryRepositoryModel {
  declare expectedActivityFrequency: 'every_day' | 'once_a_week' | 'multiple_times_a_week';
  declare id: null | string;
  declare isNew: boolean;
  declare isSaving: boolean;
  declare language: null | TemporaryLanguageModel;
  declare languageProficiencyLevel: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  declare preChallengeAssessmentSectionList: PreChallengeAssessmentSectionList;
  declare remindersAreEnabled: boolean | null;

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
