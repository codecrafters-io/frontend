// TypeScript file for temporary types until we migrate all models to TS
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import RepositoryModel from 'codecrafters-frontend/models/repository';

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
  declare repository: RepositoryModel;
}
