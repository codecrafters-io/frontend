import Model from '@ember-data/model';
import type BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { attr, belongsTo, hasMany } from '@ember-data/model';
import type SubmissionModel from './submission';

export default class CourseStageCompletionModel extends Model {
  @belongsTo('course-stage', { async: false, inverse: null }) declare courseStage: CourseStageModel;
  @belongsTo('repository', { async: false, inverse: 'courseStageCompletions' }) declare repository: RepositoryModel;
  @belongsTo('submission', { async: false, inverse: null }) declare submission: SubmissionModel;

  @hasMany('badge-award', { async: false, inverse: 'courseStageCompletion' }) declare badgeAwards: BadgeAwardModel[];

  @attr('date') declare completedAt: Date;
}
