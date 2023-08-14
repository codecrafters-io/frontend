// TypeScript file for temporary types until we migrate all models to TS

export type TemporaryRepositoryModel = {
  expectedActivityFrequency: 'every_day' | 'once_a_week' | 'multiple_times_a_week';
  id: null | string;
  language: null | { name: string };
  languageProficiencyLevel: 'never_tried' | 'beginner' | 'intermediate' | 'advanced';
  remindersAreEnabled: boolean | null;
  save(): Promise<void>;
};
