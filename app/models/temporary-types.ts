// TypeScript file for temporary types until we migrate all models to TS
import { SectionList as PreChallengeAssessmentSectionList } from 'codecrafters-frontend/lib/pre-challenge-assessment-section-list';

export type TemporaryLanguageModel = {
  id: string;
  name: string;
};

export type TemporaryRepositoryModel = {
  expectedActivityFrequency: 'every_day' | 'once_a_week' | 'multiple_times_a_week';
  id: null | string;
  language: null | TemporaryLanguageModel;
  languageProficiencyLevel: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  preChallengeAssessmentSectionList: PreChallengeAssessmentSectionList;
  remindersAreEnabled: boolean | null;
  save(): Promise<void>;
};
